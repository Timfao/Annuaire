import * as SQLite from 'expo-sqlite';

const DB_NAME = 'campus.db';

export async function initDatabase(): Promise<void> {
  try {
    const db = SQLite.openDatabaseSync(DB_NAME);
    
    // Créer les tables si elles n'existent pas
    await createTables(db);
    
    console.log(' Base de données initialisée avec succès');
  } catch (error) {
    console.error(' Erreur lors de l\'initialisation de la base de données:', error);
    throw error;
  }
}

async function createTables(db: SQLite.SQLiteDatabase): Promise<void> {
  // Table des actualités en cache
  db.execSync(`
    CREATE TABLE IF NOT EXISTS news (
      id INTEGER PRIMARY KEY,
      title TEXT NOT NULL,
      date TEXT NOT NULL,
      description TEXT NOT NULL,
      content TEXT,
      imageUrl TEXT,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Table des contacts en cache
  db.execSync(`
    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      message TEXT,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Table des rapports d'incidents
  db.execSync(`
    CREATE TABLE IF NOT EXISTS reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      location TEXT,
      category TEXT NOT NULL,
      priority TEXT DEFAULT 'medium',
      status TEXT DEFAULT 'pending',
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log('Tables créées avec succès');

  // Appliquer une migration légère pour ajouter des colonnes facultatives manquantes
  await ensureReportExtraColumns(db);
}

export function getDatabase(): SQLite.SQLiteDatabase {
  return SQLite.openDatabaseSync(DB_NAME);
}

type ReportExtraColumn = 'mediaPath' | 'mediaType' | 'latitude' | 'longitude';

async function ensureReportExtraColumns(db: SQLite.SQLiteDatabase): Promise<void> {
  try {
    const columns = db.getAllSync("PRAGMA table_info(reports)") as Array<{ name: string }>;
    const existing = new Set(columns.map((c) => c.name));

    const toAdd: ReportExtraColumn[] = [];
    if (!existing.has('mediaPath')) toAdd.push('mediaPath');
    if (!existing.has('mediaType')) toAdd.push('mediaType');
    if (!existing.has('latitude')) toAdd.push('latitude');
    if (!existing.has('longitude')) toAdd.push('longitude');

    for (const col of toAdd) {
      if (col === 'latitude' || col === 'longitude') {
        db.execSync(`ALTER TABLE reports ADD COLUMN ${col} REAL`);
      } else {
        db.execSync(`ALTER TABLE reports ADD COLUMN ${col} TEXT`);
      }
    }
  } catch (error) {
    console.error(' Erreur migration table reports:', error);
  }
}

// ========== FONCTIONS POUR LES ACTUALITÉS ==========

export async function insertNews(newsList: any[]): Promise<void> {
  try {
    const db = getDatabase();
    
    // Vider la table avant d'insérer les nouvelles données
    db.execSync('DELETE FROM news');
    
    // Insérer les nouvelles actualités
    const stmt = db.prepareSync(
      'INSERT INTO news (id, title, date, description, content, imageUrl, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)'
    );
    
    for (const item of newsList) {
      // Gestion sécurisée de la date
      let dateStr = '';
      if (item.date) {
        try {
          dateStr = new Date(item.date).toISOString();
        } catch {
          dateStr = new Date().toISOString();
        }
      } else {
        dateStr = new Date().toISOString();
      }

      // Gestion sécurisée de createdAt
      let createdAtStr = '';
      if (item.createdAt) {
        try {
          createdAtStr = new Date(item.createdAt).toISOString();
        } catch {
          createdAtStr = new Date().toISOString();
        }
      } else {
        createdAtStr = new Date().toISOString();
      }

      stmt.executeSync([
        item.id,
        item.title || item.titre || 'Sans titre',
        dateStr,
        item.description || item.desc || '',
        item.content || item.contenu || '',
        item.imageUrl || item.image || '',
        createdAtStr
      ]);
    }
    
    console.log('Actualités mises en cache');
  } catch (error) {
    console.error(' Erreur lors de la mise en cache des actualités:', error);
  }
}

export async function getNews(): Promise<any[]> {
  try {
    const db = getDatabase();
    const result = db.getAllSync('SELECT * FROM news ORDER BY date DESC');
    
    return result.map((item: any) => ({
      ...item,
      createdAt: new Date(item.createdAt),
    }));
  } catch (error) {
    console.error(' Erreur lors de la récupération des actualités:', error);
    return [];
  }
}

export async function getNewsById(id: number): Promise<any | null> {
  try {
    const db = getDatabase();
    const result = db.getFirstSync('SELECT * FROM news WHERE id = ?', [id]) as any;
    
    if (result) {
      return {
        ...result,
        createdAt: new Date(result.createdAt),
      };
    }
    
    return null;
  } catch (error) {
    console.error(' Erreur lors de la récupération de l\'actualité:', error);
    return null;
  }
}

// ========== FONCTIONS POUR LES CONTACTS ==========

export async function insertContacts(contactsList: any[]): Promise<void> {
  try {
    const db = getDatabase();
    
    // Vider la table avant d'insérer les nouvelles données
    db.execSync('DELETE FROM contacts');
    
    // Insérer les nouveaux contacts
    const stmt = db.prepareSync(
      'INSERT INTO contacts (id, name, email, phone, message) VALUES (?, ?, ?, ?, ?)'
    );
    
    for (const contact of contactsList) {
      stmt.executeSync([
        contact.id,
        contact.name || contact.nom || 'Inconnu',
        contact.email || '',
        contact.phone || contact.telephone || '',
        contact.message || contact.role || contact.department || ''
      ]);
    }
    
    console.log(' Contacts mis en cache');
  } catch (error) {
    console.error(' Erreur lors de la mise en cache des contacts:', error);
  }
}

export async function getContacts(): Promise<any[]> {
  try {
    const db = getDatabase();
    const result = db.getAllSync('SELECT * FROM contacts ORDER BY name ASC');
    return result;
  } catch (error) {
    console.error(' Erreur lors de la récupération des contacts:', error);
    return [];
  }
}

// ========== FONCTIONS POUR LES RAPPORTS ==========

export type SaveReportInput = {
  title: string;
  description: string;
  category?: string;
  mediaPath?: string;
  mediaType?: 'photo' | 'video';
  latitude: number;
  longitude: number;
  createdAt?: Date;
};

export async function saveReport(input: SaveReportInput): Promise<number> {
  try {
    const db = getDatabase();

    const createdAtIso = (input.createdAt ?? new Date()).toISOString();

    // Encodage de la localisation en texte lisible JSON
    const locationJson = JSON.stringify({
      latitude: input.latitude,
      longitude: input.longitude,
    });

    const stmt = db.prepareSync(
      `INSERT INTO reports (title, description, location, category, priority, status, createdAt, updatedAt, mediaPath, mediaType, latitude, longitude)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    );

    const result = stmt.executeSync([
      input.title,
      input.description,
      locationJson,
      input.category ?? 'general',
      'medium',
      'pending',
      createdAtIso,
      createdAtIso,
      input.mediaPath ?? null,
      input.mediaType ?? null,
      input.latitude,
      input.longitude,
    ]) as unknown as { lastInsertRowId?: number };

    const id = (result && 'lastInsertRowId' in result && (result as any).lastInsertRowId) || 0;
    console.log(' Rapport enregistré, id =', id);
    return id;
  } catch (error) {
    console.error(' Erreur lors de l\'enregistrement du rapport:', error);
    throw error;
  }
}