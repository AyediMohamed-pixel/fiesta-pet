import { Component,   OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import   { ActivatedRoute } from "@angular/router"
import { RouterModule } from "@angular/router"
import   { AnimalService } from "../../shared/services/animal.service"
import   { Pet } from "../../shared/models/pet.model"

@Component({
  selector: "app-view-animal",
  templateUrl: "./view-animal.page.html",
  styleUrls: ["./view-animal.page.scss"],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
})
export class ViewAnimalPage implements OnInit {
  petInfo: Pet | null = null
  loading = false
  error: string | null = null

  constructor(
    private route: ActivatedRoute,
    private animalService: AnimalService,
  ) {}

  ngOnInit() {
    // Get animal ID from route parameters
    const animalId = this.route.snapshot.paramMap.get("id")

    if (animalId) {
      this.loadAnimalData(animalId)
    } else {
      this.error = "ID de l'animal non fourni"
    }
  }

  loadAnimalData(id: string) {
    this.loading = true
    this.error = null

    this.animalService.getAnimalById(id).subscribe({
      next: (animal: Pet) => {
        this.petInfo = animal
        this.updatePetEmoji()
        this.loading = false
      },
      error: (error) => {
        console.error("Error loading animal data:", error)
        this.error = "Erreur lors du chargement des informations de l'animal"
        this.loading = false
      },
    })
  }

  getTranslatedAnimalType(animalType: string): string {
    // If we have the animalType object with label, use it directly
    if (this.petInfo?.animalType?.label) {
      return this.petInfo.animalType.label
    }

    // Fallback translations for direct animal type strings
    const translations: { [key: string]: string } = {
      dog: "Chien",
      cat: "Chat",
      bird: "Oiseau",
      rabbit: "Lapin",
      hamster: "Hamster",
      fish: "Poisson",
      turtle: "Tortue",
      snake: "Serpent",
      lizard: "Lézard",
      horse: "Cheval",
      other: "Autre",
    }
    return translations[animalType?.toLowerCase()] || animalType || "-"
  }

  updatePetEmoji() {
    if (this.petInfo) {
      const emojiMap: { [key: string]: string } = {
        dog: "🐕",
        cat: "🐱",
        bird: "🐦",
        rabbit: "🐰",
        hamster: "🐹",
        fish: "🐠",
        turtle: "🐢",
        snake: "🐍",
        lizard: "🦎",
        horse: "🐴",
        other: "🐾",
      }

      // Get animal type from the animalType object label or fallback to direct string
      const animalTypeKey = this.petInfo.animalType?.label?.toLowerCase() || "other"
      const emoji = emojiMap[animalTypeKey] || "🐾"

      setTimeout(() => {
        const emojiElement = document.getElementById("petEmoji")
        if (emojiElement) {
          emojiElement.textContent = emoji
        }
      }, 100)
    }
  }
}
