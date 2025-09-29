import { Component,  OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { IonicModule,  ToastController } from "@ionic/angular"
import { RouterModule } from "@angular/router"
import  { AnimalService } from "../shared/services/animal.service"
import  { Pet } from "../shared/models/pet.model"

@Component({
  selector: "app-animal",
  templateUrl: "./animal.page.html",
  styleUrls: ["./animal.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule],
})
export class AnimalPage implements OnInit {
  animals: Pet[] = []
  filteredAnimals: Pet[] = []
  loading = false
  error = ""

  searchTerm = ""
  selectedType = ""
  selectedAnimal: Pet | null = null
  isDetailModalOpen = false
  viewMode: "grid" | "list" = "grid"
  favoriteAnimals: Set<string> = new Set()
  sortBy: "name" | "type" | "owner" | "recent" = "name"
  sortOrder: "asc" | "desc" = "asc"

  constructor(
    private animalService: AnimalService,
    private toastController: ToastController,
  ) {}

  ngOnInit() {
    this.loadAnimals()
    this.loadFavorites()
  }

  loadAnimals() {
    this.loading = true
    this.error = ""

    this.animalService.getAllAnimals().subscribe({
      next: (animals) => {
        this.animals = animals
        this.filteredAnimals = animals
        this.loading = false
      },
      error: (error) => {
        console.error("Error loading animals:", error)
        this.error = "Failed to load animals. Please try again."
        this.loading = false
      },
    })
  }

  onSearchChange(event: any) {
    this.searchTerm = event.target.value
    this.filterAnimals()
  }

  onTypeFilterChange() {
    this.filterAnimals()
  }

  filterAnimals() {
    let filtered = this.animals

    // Filter by search term
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase()
      filtered = filtered.filter(
        (animal) =>
          animal.animalName.toLowerCase().includes(searchLower) ||
          animal.ownerName.toLowerCase().includes(searchLower) ||
          this.getTranslatedAnimalType(animal.animalType).toLowerCase().includes(searchLower),
      )
    }

    // Filter by type
    if (this.selectedType) {
      filtered = filtered.filter((animal) => this.getTranslatedAnimalType(animal.animalType) === this.selectedType)
    }

    this.filteredAnimals = filtered
    this.sortAnimals()
  }

  getUniqueOwners(): number {
    const uniqueOwners = new Set(this.animals.map((animal) => animal.ownerName))
    return uniqueOwners.size
  }

  getAnimalEmoji(animalType: any): string {
    const type =
      typeof animalType === "object" && animalType?.label
        ? animalType.label.toLowerCase()
        : (animalType || "").toLowerCase()

    const emojiMap: { [key: string]: string } = {
      dog: "🐕",
      chien: "🐕",
      cat: "🐱",
      chat: "🐱",
      bird: "🐦",
      oiseau: "🐦",
      fish: "🐠",
      poisson: "🐠",
      rabbit: "🐰",
      lapin: "🐰",
      hamster: "🐹",
      "guinea pig": "🐹",
      turtle: "🐢",
      tortue: "🐢",
      snake: "🐍",
      serpent: "🐍",
      lizard: "🦎",
    }
    return emojiMap[type] || "🐾"
  }

  getOwnerInitials(ownerName: string): string {
    return ownerName
      .split(" ")
      .map((name) => name.charAt(0).toUpperCase())
      .slice(0, 2)
      .join("")
  }

  getTypeClass(animalType: any): string {
    const type = this.getTranslatedAnimalType(animalType).toLowerCase()
    const classMap: { [key: string]: string } = {
      chien: "chien",
      chat: "chat",
      oiseau: "oiseau",
    }
    return classMap[type] || "default"
  }

  getTranslatedAnimalType(animalType: any): string {
    if (typeof animalType === "object" && animalType?.label) {
      const typeMap: { [key: string]: string } = {
        dog: "Chien",
        cat: "Chat",
        bird: "Oiseau",
        fish: "Poisson",
        rabbit: "Lapin",
        hamster: "Hamster",
        "guinea pig": "Cochon d'Inde",
        turtle: "Tortue",
        snake: "Serpent",
        lizard: "Lézard",
      }
      return typeMap[animalType.label.toLowerCase()] || animalType.label
    }
    return animalType || "Unknown"
  }

  downloadQRCode(animal: Pet) {
    if (!animal.qrCode || animal.qrCode.trim() === "") {
      console.warn("No QR code available for this animal")
      this.showToast("Aucun code QR disponible pour cet animal", "warning")
      return
    }

    const qrCodeUrl = animal.qrCode.trim().replace(/^["']|["']$/g, "")
    const link = document.createElement("a")
    link.href = qrCodeUrl
    link.download = `${animal.animalName}_QRCode.png`
    link.target = "_blank"

    fetch(qrCodeUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob)
        link.href = url
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
        this.showToast("Code QR téléchargé avec succès", "success")
      })
      .catch((error) => {
        console.error("Error downloading QR code:", error)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        this.showToast("Erreur lors du téléchargement", "danger")
      })
  }

  goToDetail(animalId: string) {
    window.location.href = `/animal/detail-animal/${animalId}`
  }

  trackByAnimalId(index: number, animal: Pet): string {
    return animal.id
  }

  loadFavorites() {
    const saved = localStorage.getItem("favoriteAnimals")
    if (saved) {
      this.favoriteAnimals = new Set(JSON.parse(saved))
    }
  }

  saveFavorites() {
    localStorage.setItem("favoriteAnimals", JSON.stringify([...this.favoriteAnimals]))
  }

  toggleFavorite(animalId: string) {
    if (this.favoriteAnimals.has(animalId)) {
      this.favoriteAnimals.delete(animalId)
    } else {
      this.favoriteAnimals.add(animalId)
    }
    this.saveFavorites()
  }

  isFavorite(animalId: string): boolean {
    return this.favoriteAnimals.has(animalId)
  }

  openDetailModal(animal: Pet) {
    this.selectedAnimal = animal
    this.isDetailModalOpen = true
  }

  closeDetailModal() {
    this.isDetailModalOpen = false
    this.selectedAnimal = null
  }

  toggleViewMode() {
    this.viewMode = this.viewMode === "grid" ? "list" : "grid"
  }

  onSortChange() {
    this.sortAnimals()
  }

  toggleSortOrder() {
    this.sortOrder = this.sortOrder === "asc" ? "desc" : "asc"
    this.sortAnimals()
  }

  sortAnimals() {
    this.filteredAnimals.sort((a, b) => {
      let comparison = 0

      switch (this.sortBy) {
        case "name":
          comparison = a.animalName.localeCompare(b.animalName)
          break
        case "type":
          comparison = this.getTranslatedAnimalType(a.animalType).localeCompare(
            this.getTranslatedAnimalType(b.animalType),
          )
          break
        case "owner":
          comparison = a.ownerName.localeCompare(b.ownerName)
          break
        case "recent":
          comparison = new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
          break
      }

      return this.sortOrder === "asc" ? comparison : -comparison
    })
  }
 

  getAnimalDescription(animal: Pet): string {
    const type = this.getTranslatedAnimalType(animal.animalType) 
    return `${type} • Propriétaire: ${animal.ownerName}`
  }

  getAnimalStats() {
    const totalAnimals = this.animals.length
    const uniqueOwners = this.getUniqueOwners()
    const favoriteCount = this.favoriteAnimals.size

    return {
      total: totalAnimals,
      owners: uniqueOwners,
      favorites: favoriteCount,
      types: this.getUniqueTypes().length,
    }
  }

  getUniqueTypes(): string[] {
    const types = new Set(this.animals.map((animal) => this.getTranslatedAnimalType(animal.animalType)))
    return Array.from(types).sort()
  }

  clearFilters() {
    this.searchTerm = ""
    this.selectedType = ""
    this.sortBy = "name"
    this.sortOrder = "asc"
    this.filterAnimals()
  }

  private async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: "bottom",
      color,
      buttons: [
        {
          text: "Fermer",
          role: "cancel",
        },
      ],
    })
    await toast.present()
  }
}
