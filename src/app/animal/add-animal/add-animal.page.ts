import { Component,   OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { RouterModule } from "@angular/router"
// Ionic imports removed as we're using standard HTML elements
import * as QRCode from "qrcode"
import   { AnimalService } from "../../shared/services/animal.service"
import   { AnimalType, CreatePetDto } from "../../shared/models/pet.model"
import { firstValueFrom } from "rxjs"
import { environment } from "src/environments/environment.prod"

@Component({
  selector: "app-add-animal",
  templateUrl: "./add-animal.page.html",
  styleUrls: ["./add-animal.page.scss"],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
  ],
})
export class AddAnimalPage implements OnInit {
  // Form properties
  selectedAnimal = ""
  selectedAnimalTypeId = ""
  petName = ""
  ownerName = ""
  phoneNumbers: string[] = [""] 
  notes = ""
  showQRResult = false
  qrCodeDataURL = ""
  animalId = ""

  pathUrl = environment.DESKTOP_URL;

  // Dynamic data
  animalTypes: AnimalType[] = []

  // Loading and error states
  isLoading = false
  isSaving = false
  loadingAnimalTypes = false
  errorMessage = ""
  showToast = false
  toastMessage = ""
  toastColor = "success"

  constructor(private animalService: AnimalService) {
    // Constructor simplified - no longer using Ionic icons
  }

  async ngOnInit() {
    await this.loadAnimalTypes()
  }

  async loadAnimalTypes() {
    try {
      this.loadingAnimalTypes = true
      this.animalTypes = await firstValueFrom(this.animalService.getAnimalTypes())
      console.log(" this.animalTypes", this.animalTypes)
    } catch (error) {
      console.error("Error loading animal types:", error)
      this.showToastMessage("Erreur lors du chargement des types d'animaux", "danger")
    } finally {
      this.loadingAnimalTypes = false
    }
  }

  selectAnimal(animalType: AnimalType) {
    this.selectedAnimal = animalType.label.toLowerCase()
    this.selectedAnimalTypeId = animalType.id
  }

  showToastMessage(message: string, color = "success") {
    this.toastMessage = message
    this.toastColor = color
    this.showToast = true
  }

  addPhoneField() {
    this.phoneNumbers.push("")
  }

  removePhoneField(index: number) {
    if (this.phoneNumbers.length > 1) {
      this.phoneNumbers.splice(index, 1)
    }
  }

  isFormValid(): boolean {
    return (
      this.selectedAnimal !== "" &&
      this.selectedAnimalTypeId !== "" &&
      this.petName.trim() !== "" &&
      this.ownerName.trim() !== "" &&
      this.phoneNumbers.some((phone) => phone.trim() !== "")
    )
  }

  async generateQR() {
    if (!this.selectedAnimal || !this.petName || !this.ownerName || !this.selectedAnimalTypeId) {
      this.showToastMessage("Veuillez remplir tous les champs obligatoires", "danger")
      return
    }

    try {
      this.isSaving = true

      // Create the animal data for saving to database
      const createPetDto: CreatePetDto = {
        animalName: this.petName,
        ownerName: this.ownerName,
        phoneNumbers: this.phoneNumbers.filter((phone) => phone.trim() !== ""),
        additionalNote: this.notes || "",
        animalTypeId: this.selectedAnimalTypeId,
      }

      // Save to database
      const savedAnimal = await firstValueFrom(this.animalService.createAnimal(createPetDto))
      this.animalId = savedAnimal.id

      // Create the URL for the animal detail page
      const animalDetailURL = `${this.pathUrl}animal/detail-animal/${this.animalId}`

      // Generate QR code with higher error correction for logo overlay
      const qrCodeDataURL = await QRCode.toDataURL(animalDetailURL, {
        width: 256,
        margin: 2,
        errorCorrectionLevel: "H", // High error correction for logo overlay
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      })

      // Create canvas to overlay logo
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      if (!ctx) {
        console.error("Could not get canvas context")
        return
      }
      canvas.width = 256
      canvas.height = 256

      // Load QR code image
      const qrImage = new Image()
      qrImage.onload = () => {
        // Draw QR code
        ctx.drawImage(qrImage, 0, 0, 256, 256)

        // Load and draw logo
        const logoImage = new Image()
        logoImage.onload = () => {
          // Calculate logo size (about 20% of QR code size)
          const logoSize = 100
          const logoX = (256 - logoSize) / 2
          const logoY = (256 - logoSize) / 2

          // Draw white background square for logo
          ctx.fillStyle = "#FFFFFF"
          const squareSize = logoSize + 4
          const squareX = (256 - squareSize) / 2
          const squareY = (256 - squareSize) / 2
          ctx.fillRect(squareX, squareY, squareSize, squareSize)

          // Draw logo
          ctx.drawImage(logoImage, logoX, logoY, logoSize, logoSize)

          // Update QR code data URL
          this.qrCodeDataURL = canvas.toDataURL("image/png")

          // Upload QR code to server
          this.uploadQRCodeToServer()

          // Show the QR result section
          this.showQRResult = true

          // Scroll to QR result
          setTimeout(() => {
            const qrElement = document.querySelector(".qr-result")
            if (qrElement) {
              qrElement.scrollIntoView({ behavior: "smooth" })
            }
          }, 100)
        }
        logoImage.src = "assets/img/7.png"
      }
      qrImage.src = qrCodeDataURL

      this.showToastMessage("Animal enregistré avec succès!", "success")
    } catch (error) {
      console.error("Error saving animal or generating QR code:", error)
      this.showToastMessage("Erreur lors de l'enregistrement de l'animal", "danger")
    } finally {
      this.isSaving = false
    }
  }

  async uploadQRCodeToServer() {
    if (!this.qrCodeDataURL || !this.animalId) {
      console.error('QR code data URL or animal ID is missing')
      return
    }

    try {
      console.log('Uploading QR code to server for animal:', this.animalId)
      
      // Extract base64 data (remove data:image/png;base64, prefix)
      const base64Data = this.qrCodeDataURL.split(',')[1]
      
      const response = await firstValueFrom(
        this.animalService.uploadQRCode(this.animalId, base64Data)
      )
      
      console.log('QR code uploaded successfully:', response)
      this.showToastMessage('QR code sauvegardé avec succès!', 'success')
    } catch (error) {
      console.error('Error uploading QR code:', error)
      this.showToastMessage('Erreur lors de la sauvegarde du QR code', 'warning')
    }
  }

  downloadQRCode() {
    if (!this.qrCodeDataURL) {
      return
    }

    try {
      // Convert 3cm to pixels (assuming 96 DPI: 3cm = ~113 pixels)
      const sizeInPixels = 113

      // Create a canvas to resize to exact 3cm x 3cm
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")!
      canvas.width = sizeInPixels
      canvas.height = sizeInPixels

      // Create image from existing QR code data URL (which already includes the logo)
      const img = new Image()
      img.onload = () => {
        // Clear canvas and draw the QR code with logo at exact size
        ctx.clearRect(0, 0, sizeInPixels, sizeInPixels)
        ctx.drawImage(img, 0, 0, sizeInPixels, sizeInPixels)

        // Convert to blob and download
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob)
              const link = document.createElement("a")
              link.href = url
              link.download = `qr-code-${this.petName || "animal"}-3cmx3cm.png`
              document.body.appendChild(link)
              link.click()
              document.body.removeChild(link)
              URL.revokeObjectURL(url)
            }
          },
          "image/png",
          1.0,
        )
      }

      img.src = this.qrCodeDataURL
    } catch (error) {
      console.error("Error downloading QR code:", error)
      // Fallback: download the current QR code
      const link = document.createElement("a")
      link.href = this.qrCodeDataURL
      link.download = `qr-code-${this.petName || "animal"}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  resetForm() {
    this.selectedAnimal = ""
    this.selectedAnimalTypeId = ""
    this.petName = ""
    this.ownerName = ""
    this.phoneNumbers = [""] 
    this.notes = ""
    this.showQRResult = false
    this.qrCodeDataURL = ""
    this.animalId = ""
    this.errorMessage = ""
  }

  // Track by function to prevent DOM recreation and focus loss
  trackByIndex(index: number, item: any): number {
    return index
  }
}
