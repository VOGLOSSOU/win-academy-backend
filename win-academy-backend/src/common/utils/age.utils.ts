/**
 * Calcule l'âge à partir d'une date de naissance
 * @param dateOfBirth - Date de naissance
 * @returns L'âge en années, ou null si la date est invalide
 */
export function calculateAge(dateOfBirth: Date | string | null): number | null {
  if (!dateOfBirth) return null;

  const birthDate = new Date(dateOfBirth);
  const today = new Date();

  if (isNaN(birthDate.getTime())) return null;

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  // Ajuster si l'anniversaire n'a pas encore eu lieu cette année
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

/**
 * Vérifie si un âge est dans une plage donnée
 * @param age - L'âge à vérifier
 * @param minAge - Age minimum
 * @param maxAge - Age maximum
 * @returns true si l'âge est dans la plage
 */
export function isAgeInRange(age: number | null, minAge: number, maxAge: number): boolean {
  if (age === null) return false;
  return age >= minAge && age <= maxAge;
}
