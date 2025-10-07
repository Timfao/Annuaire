// Type pour les contacts de l'annuaire ESATIC
export interface Contact {
  id: number;
  name: string;
  role: string;
  phone?: string;
  email?: string;
  department: string;
}

// Type pour les catégories de contacts
export type ContactCategory = 
  | 'Administration'
  | 'Enseignants'
  | 'Services'
  | 'Support Technique'
  | 'Autres';

// Type pour filtrer les contacts
export interface ContactFilter {
  category?: ContactCategory;
  department?: string;
  search?: string;
}
