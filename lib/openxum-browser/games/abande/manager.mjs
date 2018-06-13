// lib/openxum-browser/games/lyngk/manager.mjs
import OpenXum from '../../openxum/manager.mjs';
import Abande from '../../../openxum-core/games/abande/index.mjs';
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
       // return this.engine().current_color() === Player.PLAYER_1 ? 'White' : 'Black';
    }

    static get_name() {
        return 'abande';
    }

    get_winner_color() {
        // Retourne sous forme d'une chaîne de caractères la couleur du vainqueur
       // return this.engine().winner_is() === Player.PLAYER_1 ? 'white' : 'black';
    }

    process_move() {
        // À implémenter si le manager doit gérer des éléments annexes des coups
        // Par défaut, laisser vide
    }
}

export default {
    Manager: Manager
};