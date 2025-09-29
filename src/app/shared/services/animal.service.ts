import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { RequestsService } from './requests.service';
import { Pet, CreatePetDto, UpdatePetDto, AnimalType } from '../models/pet.model';

@Injectable({
  providedIn: 'root'
})
export class AnimalService {
  private animalsSubject = new BehaviorSubject<Pet[]>([]);
  public animals$ = this.animalsSubject.asObservable();

  constructor(private requestsService: RequestsService) {}

  /**
   * Create a new animal
   */
  createAnimal(animalData: CreatePetDto): Observable<Pet> {
    return this.requestsService.post('animals', animalData).pipe(
      map((response: Pet) => {
        // Update local animals list
        this.refreshAnimals();
        return response;
      }),
      catchError((error) => {
        console.error('Error creating animal:', error);
        throw error;
      })
    );
  }

  /**
   * Get all animals
   */
  getAllAnimals(): Observable<Pet[]> {
    return this.requestsService.get('animals').pipe(
      map((response: Pet[]) => {
        this.animalsSubject.next(response);
        return response;
      }),
      catchError((error) => {
        console.error('Error fetching animals:', error);
        throw error;
      })
    );
  }

  /**
   * Get animal by ID
   */
  getAnimalById(id: string): Observable<Pet> {
    return this.requestsService.get(`animals/${id}`).pipe(
      map((response: Pet) => response),
      catchError((error) => {
        console.error('Error fetching animal by ID:', error);
        throw error;
      })
    );
  }

  /**
   * Update an animal
   */
  updateAnimal(id: string, animalData: UpdatePetDto): Observable<Pet> {
    return this.requestsService.patch(`animals/${id}`, animalData).pipe(
      map((response: Pet) => {
        // Update local animals list
        this.refreshAnimals();
        return response;
      }),
      catchError((error) => {
        console.error('Error updating animal:', error);
        throw error;
      })
    );
  }

  /**
   * Delete an animal
   */
  deleteAnimal(id: string): Observable<{ message: string }> {
    return this.requestsService.delete(`animals/${id}`).pipe(
      map((response: { message: string }) => {
        // Update local animals list
        this.refreshAnimals();
        return response;
      }),
      catchError((error) => {
        console.error('Error deleting animal:', error);
        throw error;
      })
    );
  }

  /**
   * Get animals by owner ID
   */
  getAnimalsByOwner(ownerId: string): Observable<Pet[]> {
    return this.requestsService.get(`animals/owner/${ownerId}`).pipe(
      map((response: Pet[]) => response),
      catchError((error) => {
        console.error('Error fetching animals by owner:', error);
        throw error;
      })
    );
  }

  /**
   * Get animals by animal type ID
   */
  getAnimalsByType(animalTypeId: string): Observable<Pet[]> {
    return this.requestsService.get(`animals/type/${animalTypeId}`).pipe(
      map((response: Pet[]) => response),
      catchError((error) => {
        console.error('Error fetching animals by type:', error);
        throw error;
      })
    );
  }

  /**
   * Get animals with query parameters
   */
  getAnimalsWithFilters(ownerId?: string, animalTypeId?: string): Observable<Pet[]> {
    let queryParams = '';
    const params: string[] = [];
    
    if (ownerId) {
      params.push(`ownerId=${ownerId}`);
    }
    
    if (animalTypeId) {
      params.push(`animalTypeId=${animalTypeId}`);
    }
    
    if (params.length > 0) {
      queryParams = '?' + params.join('&');
    }

    return this.requestsService.get(`animals${queryParams}`).pipe(
      map((response: Pet[]) => {
        this.animalsSubject.next(response);
        return response;
      }),
      catchError((error) => {
        console.error('Error fetching animals with filters:', error);
        throw error;
      })
    );
  }

  /**
   * Refresh the animals list
   */
  refreshAnimals(): void {
    this.getAllAnimals().subscribe();
  }

  /**
   * Get current animals from BehaviorSubject
   */
  getCurrentAnimals(): Pet[] {
    return this.animalsSubject.value;
  }

  /**
   * Clear animals cache
   */
  clearAnimalsCache(): void {
    this.animalsSubject.next([]);
  }

  /**
   * Search animals by name
   */
  searchAnimalsByName(searchTerm: string): Observable<Pet[]> {
    return this.animals$.pipe(
      map(animals => 
        animals.filter(animal => 
          animal.animalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          animal.ownerName.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    );
  }

  /**
   * Get all animal types
   */
  getAnimalTypes(): Observable<AnimalType[]> {
    return this.requestsService.get('animal-types').pipe(
      map((response: AnimalType[]) => response),
      catchError((error) => {
        console.error('Error fetching animal types:', error);
        throw error;
      })
    );
  }

  /**
   * Upload QR code for an animal
   */
  uploadQRCode(animalId: string, qrCodeBase64: string): Observable<any> {
    return this.requestsService.post(`animals/${animalId}/upload-qr`, {
      qrCodeBase64: qrCodeBase64
    }).pipe(
      map((response: any) => {
        // Update local animals list after QR code upload
        this.refreshAnimals();
        return response;
      }),
      catchError((error) => {
        console.error('Error uploading QR code:', error);
        throw error;
      })
    );
  }



  /**
   * Utility method to validate animal data before submission
   */
  validateAnimalData(animalData: CreatePetDto | UpdatePetDto): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if ('animalName' in animalData && (!animalData.animalName || animalData.animalName.trim().length === 0)) {
      errors.push('Animal name is required');
    }

    if ('ownerName' in animalData && (!animalData.ownerName || animalData.ownerName.trim().length === 0)) {
      errors.push('Owner name is required');
    }

    if ('phoneNumbers' in animalData && (!animalData.phoneNumbers || animalData.phoneNumbers.length === 0)) {
      errors.push('At least one phone number is required');
    }

    if ('animalTypeId' in animalData && (!animalData.animalTypeId || animalData.animalTypeId.trim().length === 0)) {
      errors.push('Animal type is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}