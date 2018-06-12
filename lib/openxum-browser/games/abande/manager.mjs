// lib/openxum-browser/games/Abande/manager.mjs
import OpenXum from '../../openxum/manager.mjs';
import Abande from '../../../openxum-core/games/Abande/index.mjs';
// ...

class Manager extends OpenXum.Manager {
    constructor(e, g, o, s) {
        super(e, g, o, s);
        this.that(this);
    }

    build_move() {
        // Retourne l'implémentation d'un mouvement par défaut du jeu
        return new Abande.Move();
    }

    get_current_color() {
        // Retourne la couleur du joueur courant
        return 0; //this.engine().current_color() === Player.PLAYER_1 ? 'White' : 'Black';
    }

    static get_name() {
        // Retourne le nom du jeu
        return 'Abande';
    }

    get_winner_color() {
        // Retourne sous forme d'une chaîne de caractères la couleur du vainqueur
        return 0;// this.engine().winner_is() === Player.PLAYER_1 ? 'white' : 'black';
    }

    process_move() {
        // À implémenter si le manager doit gérer des éléments annexes des coups
        // Par défaut, laisser vide
    }
}

export default {
    Manager: Manager
};