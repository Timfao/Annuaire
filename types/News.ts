// Type pour les actualités de l'ESATIC
export interface News {
  id: number;
  title: string;
  date: string;
  description: string;
  content: string;
  createdAt: Date;
}

// Type pour les catégories d'actualités
export type NewsCategory = 
  | 'Rentrée Académique'
  | 'Événements'
  | 'Formation'
  | 'Recherche'
  | 'Administration'
  | 'Autres';

// Type pour les filtres d'actualités
export interface NewsFilter {
  category?: NewsCategory;
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
}