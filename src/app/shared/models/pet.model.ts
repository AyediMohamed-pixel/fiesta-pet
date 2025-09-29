export interface AnimalType {
  id: string;
  label: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Owner {
  id: string;
  username: string;
  fullName: string;
  email?: string;
}

export interface Pet {
  id: string;
  animalName: string;
  ownerName: string;
  phoneNumbers: string[];
  additionalNote?: string;
  animalTypeId: string;
  qrCode?: string;
  img_uri?: string;
  ownerId?: string;
  birthDate?: string; // Optional birth date for age calculation
  breed?: string; // Optional breed information
  color?: string; // Optional color information
  createdAt: Date;
  updatedAt: Date;
  animalType?: AnimalType;
  owner?: Owner;
}

export interface CreatePetDto {
  animalName: string;
  ownerName: string;
  phoneNumbers: string[];
  additionalNote?: string;
  animalTypeId: string;
  qrCode?: string;
  img_uri?: string;
  ownerId?: string;
  birthDate?: string;
  breed?: string;
  color?: string;
}

export interface UpdatePetDto {
  animalName?: string;
  ownerName?: string;
  phoneNumbers?: string[];
  additionalNote?: string;
  animalTypeId?: string;
  qrCode?: string;
  img_uri?: string;
  ownerId?: string;
}

export class PetClass {
  constructor(
    public id: string,
    public animalName: string,
    public ownerName: string,
    public phoneNumbers: string[],
    public additionalNote?: string,
    public animalType?: string, // AnimalType label for display
    public qrCode?: string,
    public img_uri?: string,
    public owner?: any
  ){}
}
