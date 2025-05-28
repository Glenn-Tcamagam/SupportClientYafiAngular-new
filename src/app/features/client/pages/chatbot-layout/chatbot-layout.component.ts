import { Component } from '@angular/core';
import { ChatbotLayoutService } from './chatbot-layout.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chatbot-layout',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './chatbot-layout.component.html',
  styleUrls: ['./chatbot-layout.component.css']
})
// ... imports et décorateur inchangés ...

export class ChatbotLayoutComponent {
  messages: { from: 'user' | 'bot', text: string }[] = [];
  userInput = '';
  currentIntent: string | null = null;
  isLoading = false;

  formData = {
    email: '',
    description: '',
    numero_commande: ''
  };

  step = 0;

  readonly KNOWN_SIMPLE_INTENTS = [
    'salutation', 'remerciement', 'aurevoir', 'passer_commande', 'mode_paiement',
    'suivi_commande', 'annulation_commande', 'délai_livraison', 'contacter_livreur',
    'devenir_partenaire', 'disponibilite_service'
  ];

  readonly KNOWN_COMPLEX_INTENTS = [
    'commande_non_livree', 'commande_mauvais_etat',
    'double_facturation', 'remboursement', 'compte_suspendu'
  ];

  constructor(private chatbotlayoutService: ChatbotLayoutService) {}

  sendMessage() {
    if (this.isLoading) return;

    const msg = this.userInput.trim();
    if (!msg) return;

    this.messages.push({ from: 'user', text: msg });
    this.userInput = '';
    this.isLoading = true;

    // Si aucun intent encore, on détecte
    if (!this.currentIntent) {
      this.chatbotlayoutService.detectIntent(msg).subscribe({
        next: (res) => {
          const detectedIntent = res.intent?.name ?? '';
          console.log('🎯 Intent détecté :', detectedIntent);

          if (this.KNOWN_SIMPLE_INTENTS.includes(detectedIntent)) {
            this.currentIntent = detectedIntent;

            const responses: any = {
              salutation: 'Bonjour ! Comment puis-je vous aider ?',
              remerciement: 'Avec plaisir ! 😊',
              aurevoir: 'Au revoir, à bientôt ! 👋',
              passer_commande: [
                '1. Ouvrez l’application YaFi',
                '2. Sélectionnez un restaurant',
                '3. Ajoutez vos plats au panier',
                '4. Validez l’adresse de livraison',
                '5. Procédez au paiement'
              ],
              mode_paiement: 'Nous acceptons les paiements par Orange Money et MTN Mobile Money.',
              suivi_commande: [
                "1. Allez dans 'Historique des commandes'",
                "2. Sélectionnez la commande en cours",
                "3. Vous verrez le statut en temps réel"
              ],
              annulation_commande: "Malheureusement, une commande confirmée ne peut plus être annulée. Si vous rencontrez un problème, contactez notre support.",
              délai_livraison: [
                "Délais moyens :",
                "- Plats chauds : 30-45 min",
                "- Supermarché : 45-60 min",
                "Vous pouvez suivre en direct dans l’application"
              ],
              contacter_livreur: [
                "1. Allez dans 'Suivi de commande'",
                "2. Cliquez sur 'Contacter le livreur'",
                "3. Choisissez appel ou message"
              ],
              devenir_partenaire: [
                "1. Remplissez le formulaire sur yafiapp.com/partenaires",
                "2. Ou contactez notre équipe au 683 611 329",
                "3. Ou par mail : infos@yafiapp.com"
              ],
              disponibilite_service: "Notre service est disponible tous les jours de 8h à 23h."
            };

            const response = responses[this.currentIntent ?? ''];
            if (Array.isArray(response)) {
              this.messages.push({ from: 'bot', text: response.join('\n') });
            } else {
              this.messages.push({ from: 'bot', text: response });
            }

            this.resetConversation(); // remet l'état à zéro
            this.isLoading = false;

          } else if (this.KNOWN_COMPLEX_INTENTS.includes(detectedIntent)) {
            this.currentIntent = detectedIntent;
            this.messages.push({ from: 'bot', text: 'Merci pour votre patience. Quel est votre email ?' });
            this.step = 1;
            this.isLoading = false;
          } else {
            // Intent inconnu
            console.warn('❓ Intent non reconnu :', detectedIntent);
            this.messages.push({ from: 'bot', text: 'Désolé, je n’ai pas compris votre demande. Pouvez-vous reformuler ?' });
            this.currentIntent = null;
            this.step = 0;
            this.isLoading = false;
          }
        },
        error: () => {
          console.error("❌ Erreur lors de la détection d'intention.");
          this.messages.push({ from: 'bot', text: "❌ Une erreur est survenue. Veuillez réessayer." });
          this.isLoading = false;
        }
      });
    } else {
      // Si on est dans un formulaire
      this.handleFormStep(msg);
    }
  }

  handleFormStep(msg: string) {
    if (!this.currentIntent) {
      this.messages.push({ from: 'bot', text: 'Erreur : aucun contexte. Veuillez recharger la page.' });
      return;
    }

    this.isLoading = true;

    if (this.step === 1) {
      this.formData.email = msg;
      this.messages.push({ from: 'bot', text: this.needsOrderNumber(this.currentIntent) ? 'Quel est le numéro de la commande concernée ?' : 'Veuillez décrire votre problème svp.' });
      this.step = this.needsOrderNumber(this.currentIntent) ? 2 : 3;
      this.isLoading = false;

    } else if (this.step === 2) {
      this.formData.numero_commande = msg;
      this.messages.push({ from: 'bot', text: 'Merci. Veuillez décrire votre problème.' });
      this.step = 3;
      this.isLoading = false;

    } else if (this.step === 3) {
      this.formData.description = msg;

      const descriptionFormatted =
        `Email : ${this.formData.email}\n` +
        (this.formData.numero_commande ? `Numéro commande : ${this.formData.numero_commande}\n` : '') +
        `Description : ${this.formData.description}`;

      const payload = {
        titre: this.currentIntent.replace(/_/g, ' '),
        email: this.formData.email,
        description: descriptionFormatted,
        numero_commande: this.formData.numero_commande || null
      };

      this.chatbotlayoutService.createTicket(payload).subscribe({
        next: () => {
          const confirmationMessage =
            `✅ Votre ticket a été créé avec succès ! Voici un récapitulatif :\n` +
            `• Email : ${this.formData.email}\n` +
            (this.formData.numero_commande ? `• Numéro commande : ${this.formData.numero_commande}\n` : '') +
            `• Description : ${this.formData.description}`;

          this.messages.push({ from: 'bot', text: confirmationMessage });
          this.resetConversation();
          this.isLoading = false;
        },
        error: (err) => {
          console.error('❌ Erreur lors de la création du ticket :', err);
          this.messages.push({ from: 'bot', text: '❌ Une erreur est survenue lors de la création du ticket.' });
          this.resetConversation();
          this.isLoading = false;
        }
      });
    }
  }

  needsOrderNumber(intent: string | null): boolean {
    const intentsWithOrder = ['commande_non_livree', 'commande_mauvais_etat', 'double_facturation', 'remboursement'];
    return intentsWithOrder.includes(intent ?? '');
  }

  resetConversation() {
    this.currentIntent = null;
    this.step = 0;
    this.formData = {
      email: '',
      description: '',
      numero_commande: ''
    };
  }
}
