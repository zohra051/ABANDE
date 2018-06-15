import lib from '../../../openxum';

let coord_A1 = new lib.OpenXum.Abande.Coordinates('A',1);
let coord_A2 = new lib.OpenXum.Abande.Coordinates('A',2);
let coord_A2bis = new lib.OpenXum.Abande.Coordinates('A',2);
let coord_A3 = new lib.OpenXum.Abande.Coordinates('A',3);
let coord_A4 = new lib.OpenXum.Abande.Coordinates('A',4);
let coord_B2 = new lib.OpenXum.Abande.Coordinates('B',2);
let coord_B3 = new lib.OpenXum.Abande.Coordinates('B',3);
let coord_B4 = new lib.OpenXum.Abande.Coordinates('B',4);
let coord_D7 = new lib.OpenXum.Abande.Coordinates('D',7);
let coord_D5 =  new lib.OpenXum.Abande.Coordinates('D',5);
let coord_F1 =  new lib.OpenXum.Abande.Coordinates('F',1);
let coord_F3 = new lib.OpenXum.Abande.Coordinates('F',3);
let coord_G3 = new lib.OpenXum.Abande.Coordinates('G',3);

let put_first = lib.OpenXum.Abande.Phase.PUT_FIRST_PIECE;
let capture = lib.OpenXum.Abande.Phase.CAPTURE_PIECE;
let put = lib.OpenXum.Abande.Phase.PUT_PIECE;

let color_black = lib.OpenXum.Abande.Color.BLACK;
let color_none = lib.OpenXum.Abande.Color.NONE;
let color_white = lib.OpenXum.Abande.Color.WHITE;
let color_disponible = lib.OpenXum.Abande.Color.DISPONIBLE;

let move_first_black_A2 = new lib.OpenXum.Abande.Move(put_first,color_black,coord_A2,coord_A4);
let move_capture_black_A2_D7 = new lib.OpenXum.Abande.Move(capture,color_black,coord_A2,coord_D7);
let move_put_black_A2 = new lib.OpenXum.Abande.Move(put,color_black,coord_A2,coord_A4);
let move_put_black_A3 = new lib.OpenXum.Abande.Move(put,color_black,coord_A3,coord_A4);

let intersection = new lib.OpenXum.Abande.Intersection(coord_A3);

let engine = new lib.OpenXum.Abande.Engine(0);


/*-----------------------------------------------------------------------------------------------------------*/
if( coord_A2._number === 2) {
    console.log("TRUE");
}

console.log("TEST Coordinates : Coordonnée : " + coord_A2.letter() + coord_A2.number());

if (coord_A2.equals(coord_A2bis))
{
    console.log("TEST Coordinates : Les deux coordonnées "+coord_A2.letter()+coord_A2.number()+" et "+
        coord_A2bis.letter() + coord_A2bis.number() +" sont identiques !! ");
}

if(coord_A2.is_valid())
{
    console.log("TEST Coordinates : Les coordonnées sont valident");
}

if(coord_A2.verification())
{
    console.log("TEST Coordinates : Verification coordonnée parfaite !");
}

/*-----------------------------------------------------------------------------------------------------------*/
console.log("\n");
if (move_first_black_A2.color() === color_black)
{
    console.log("TEST Move : Couleur NOIR");
}

if(move_first_black_A2.coordinates().letter() ===  coord_A2.letter() && move_first_black_A2.coordinates().number() === coord_A2.number())
{
    console.log("TEST Move : Coordonnée "+ coord_A2.letter() + coord_A2.number());
}

if(move_capture_black_A2_D7.from().letter() === coord_A2.letter() && move_capture_black_A2_D7.from().number() === coord_A2.number())
{
    console.log("TEST Move : Coordonnée from "+ coord_A2.letter() + coord_A2.number());
}

if(move_capture_black_A2_D7.to().letter() === coord_A4.letter() && move_capture_black_A2_D7.to().number() === coord_A4.number())
{
    console.log("TEST Move : Coordonnée to "+ coord_A4.letter() + coord_A4.number());
}

if(move_capture_black_A2_D7.type() === capture)
{
    console.log("TEST Move : Type de "+ coord_A4.letter() + coord_A4.number() + " est " + capture);
}

console.log("TEST Move : GET : PUT_FIRST_PIECE BLACK A2 => " + move_first_black_A2.get());
console.log("TEST Move : GET : CAPTURE_PIECE BLACK A2 D7 => " + move_capture_black_A2_D7.get());
console.log("TEST Move : GET : PUT_PIECE BLACK A2 => " + move_put_black_A2.get());

console.log("TEST Move : PARSE : AVANT " + move_first_black_A2.get());
if(move_first_black_A2.from() !== move_capture_black_A2_D7.from() && move_first_black_A2.to() !== move_capture_black_A2_D7.to())
{
    move_first_black_A2.parse("CPBA2D7");
    console.log("TEST Move : PARSE : APRES " + move_first_black_A2.get());
}

console.log("TEST Move : TO_STRING : " + move_capture_black_A2_D7.to_string());

/*-----------------------------------------------------------------------------------------------------------*/
console.log("\n");

console.log("TEST INTERSECTION : GET COLOR : " + intersection.getColor());
intersection.setColor(color_black);
console.log("TEST INTERSECTION : SET COLOR : " + intersection.getColor());

console.log("TEST INTERSECTION : GET COORDINATE : " + intersection.getCoordinate().to_string());

console.log("TEST INTERSECTION : GET TAILLE PILLE : " + intersection.getTaillePile());
intersection.setTaillePile(2)
console.log("TEST INTERSECTION : SET TAILLE PILLE : " + intersection.getTaillePile());

intersection.taillePlus();
console.log("TEST INTERSECTION : TAILLE PILE PLUS : " + intersection.getTaillePile());

intersection.taillePileZero();
console.log("TEST INTERSECTION : TAILLE PILE ZERO : " + intersection.getTaillePile());

/*-----------------------------------------------------------------------------------------------------------*/
console.log("\n");
if(engine.type() === 0 )
{
    console.log("TEST ENGINE : TYPE : " + engine.type());
}

if(engine.current_color() === color_black)
{
    console.log("TEST ENGINE : COLOR : "+engine.current_color() + " (BLACK)");
}

if(engine.black_piece_number() === 18)
{
    console.log("TEST ENGINE : BLACK_PIECE_NUMBER : "+engine.black_piece_number());
}

if(engine.white_piece_number() === 18)
{
    console.log("TEST ENGINE : WHITE_PIECE_NUMBER : "+engine.white_piece_number());
}

if(engine.get_name() === "Abande")
{
    console.log("TEST ENGINE : NAME : " + engine.get_name());
}
/*************************************************************************************************************/
console.log("\n");
engine._all_at_none();
if(engine._intersections[coord_A2.hash()].getColor() === color_none)
{
    console.log("TEST ENGINE : PUT FIRST PIECE : ALL AT NONE : Toutes les couleurs ont bien étais mis à NONE")
}

engine._decrease_piece_number(color_black);
if(engine._black_piece_number === 17)
{
    console.log("TEST ENGINE : PUT FIRST PIECE :DECREASE PIECE NUMBER : Le nombre de pièce noir à bien décrémenté => " + engine.black_piece_number());
}

//console.log(engine.intersection());
console.log("TEST ENGINE : PUT FIRST PIECE : INTERSECTION : Aucune pièce sur le plateau." + lib.OpenXum.Abande.Color.display(color_none));
console.log("TEST ENGINE : PUT FIRST PIECE : CURRENT COLOR : " + lib.OpenXum.Abande.Color.display(engine.current_color()));
console.log("TEST ENGINE : PUT FIRST PIECE : " + engine._intersections[coord_A2.hash()].getTaillePile() + " Taille de la pile AVANT de placer un jeton");
console.log("TEST ENGINE : PUT FIRST PIECE : LA FONCTION ENTIERE : Nombre de pièce noir AVANT décrémentation " + engine.black_piece_number());
console.log("TEST ENGINE : PUT FIRST PIECE : LA FONCTION ENTIERE : Nombre de pièce blanche AVANT décrémentation " + engine.white_piece_number());
engine._put_first_piece(color_black,coord_A2);
if( engine._intersections[coord_A2.hash()].getColor() === color_black)
{

    console.log("TEST ENGINE : PUT FIRST PIECE : LA FONCTION ENTIERE : " + engine._intersections[coord_A2.hash()].getColor() +" On place un jeton (BLACK)\t A2 ");
}
console.log("TEST ENGINE : PUT FIRST PIECE : LA FONCTION ENTIERE :: Nombre de pièce noir APRES décrémentation " + engine.black_piece_number());
console.log("TEST ENGINE : PUT FIRST PIECE : LA FONCTION ENTIERE :: Nombre de pièce blanche APRES décrémentation " + engine.white_piece_number());
console.log("TEST ENGINE : PUT FIRST PIECE : " + engine._intersections[coord_A2.hash()].getTaillePile() + " Taille de la pile APRES avoir placé un jeton. Incrémentation Valide.");
console.log("TEST ENGINE : PUT FIRST PIECE : CURRENT COLOR : " + lib.OpenXum.Abande.Color.display(engine.current_color()));
//console.log(engine.intersection());
console.log("TEST ENGINE : PUT FIRST PIECE : INTERSECTION : une seule pièce sur le plateau, à la position A2 ");
engine._neighboor_dispo(coord_A2);
if( engine._intersections[coord_A1.hash()].getColor() === color_disponible &&
    engine._intersections[coord_A3.hash()].getColor() === color_disponible &&
    engine._intersections[coord_B2.hash()].getColor() === color_disponible &&
    engine._intersections[coord_B3.hash()].getColor() === color_disponible )
{
    console.log("TEST ENGINE : PUT FIRST PIECE : NEIGHBOOR DISPONIBLE : Toutes les pièces voisine de A2 sont DISPONIBLE." );
}
//console.log(engine.intersection());
engine._put_piece(color_white,coord_A1);
console.log("TEST ENGINE : PUT FIRST PIECE : INTERSECTION : deux pièces sur le plateau, à la position A1 A2 ");
//console.log(engine._get_neighboor(engine._intersections[coord_A1.hash()])); //Verificatin des voisinage
//console.log(engine.intersection());

if( engine._intersections[coord_A1.hash()].getColor() === color_white &&
    engine._intersections[coord_A3.hash()].getColor() === color_disponible &&
    engine._intersections[coord_B2.hash()].getColor() === color_disponible &&
    engine._intersections[coord_B3.hash()].getColor() === color_disponible )
{
    console.log("TEST ENGINE : PUT FIRST PIECE : NEIGHBOOR DISPONIBLE : Toutes les pièces voisine de A2 sont DISPONIBLE saut A1 qui est WHITE" );
}

/*************************************************************************************************************/

console.log("\n");


console.log("TEST ENGINE : PUT PIECE : DECREASE PIECE : Nombre de pièce noir AVANT décrémentation " + engine.black_piece_number());
console.log("TEST ENGINE : PUT PIECE : DECREASE PIECE : Nombre de pièce blanche AVANT décrémentation " + engine.white_piece_number());
engine._decrease_piece_number(color_white);
console.log("TEST ENGINE : PUT PIECE : DECREASE PIECE : Nombre de pièce noir APRES décrémentation " + engine.black_piece_number());
console.log("TEST ENGINE : PUT PIECE : DECREASE PIECE : Nombre de pièce blanche APRES décrémentation " + engine.white_piece_number());

if(engine._intersections[coord_A3.hash()].getTaillePile() === 0)
{
    console.log("TEST ENGINE : PUT PIECE : " + engine._intersections[coord_A3.hash()].getTaillePile() + " Taille de la pile AVANT de placer un jeton.");
}
console.log("TEST ENGINE : PUT PIECE : COLOR : " + engine._intersections[coord_A3.hash()].getColor() +
    " Avant de poser un jeton A3 sur le plateau, la couleur est => " + lib.OpenXum.Abande.Color.display(color_white));
engine._put_piece(color_black,coord_A3);
if( engine._intersections[coord_A3.hash()].getColor() === color_black)
{
    console.log("TEST ENGINE : PUT PIECE : " + engine._intersections[coord_A3.hash()].getColor() +" Pièce placé et couleur changé "+ lib.OpenXum.Abande.Color.display(color_black)+"\t A1 A2 A3 ");
}
if(engine._intersections[coord_A1.hash()].getTaillePile() === 1)
{
    console.log("TEST ENGINE : PUT PIECE : " + engine._intersections[coord_A3.hash()].getTaillePile() + " Taille de la pile APRES avoir placé un jeton. Incrémentation Valide");
}
if(engine._is_current_player(color_white) === true) {
    console.log("TEST ENGINE : PUT PIECE : " + engine._is_current_player(color_white) + " Current couleur est de la couleur => " + lib.OpenXum.Abande.Color.display(color_white));
}

engine._change_current_player();
if(engine._current_color === color_black)
{
    console.log("TEST ENGINE : PUT PIECE : La couleur du joueur courant à bien étais modifié => " + lib.OpenXum.Abande.Color.display(color_black));
}

//console.log(engine.intersection());
console.log("TEST ENGINE : PUT PIECE : INTERSECTION : trois pièces sur le plateau, à la position A1 A2 A3 ");
engine._neighboor_dispo(coord_A3);
if( engine._intersections[coord_A2.hash()].getColor() === color_black &&
    engine._intersections[coord_A4.hash()].getColor() === color_disponible &&
    engine._intersections[coord_B3.hash()].getColor() === color_disponible &&
    engine._intersections[coord_B4.hash()].getColor() === color_disponible )
{
    console.log("TEST ENGINE : PUT PIECE : NEIGHBOOR DISPONIBLE : Toutes les pièces voisine de A3 sont DISPONIBLE. Sauf A2 BLACK qui à étais placé précedement." );
}

/*************************************************************************************************************/
console.log("\n");

/*
engine._capture_piece(color_black,coord_A2,coord_A3);
if(engine._intersections[coord_A2.hash()].getColor() === color_none )
{
    console.log("TEST ENGINE : CAPTURE PIECE : " + engine._intersections[coord_A2.hash()].getColor() + " la couleur du from() s'est bien mise à NONE");
}
if(engine._intersections[coord_A2.hash()].getTaillePile() === 0)
{
    console.log("TEST ENGINE : CAPTURE PIECE : " + engine._intersections[coord_A2.hash()].getTaillePile() + " La pile s'est bien mise à zéro du from()");
}
if(engine._intersections[coord_A3.hash()].getColor()  === color_black)
{
    console.log("TEST ENGINE : CAPTURE PIECE : " + engine._intersections[coord_A3.hash()].getColor() + " la couleur du to() s'est bien mise à la couleur passé en paramètre");
}
if(engine._intersections[coord_A3.hash()].getTaillePile() === 2)
{
    console.log("TEST ENGINE : CAPTURE PIECE : " + engine._intersections[coord_A3.hash()].getTaillePile() + " La pile à été incrémenté. Le jeton s'est bien déplacé pour former une pile de 2 jetons");
}
*/

if(engine._are_neighbour(coord_A2,coord_A3) === true)
{
    console.log("TEST : ENGINE : ARE NEIGHBOOR : A2 et A3 sont-ils voisins ? " + engine._are_neighbour(coord_A2,coord_A3));
}
if(engine._are_neighbour(coord_A1,coord_A3) === false)
{
    console.log("TEST : ENGINE : ARE NEIGHBOOR : A1 et A3 sont-ils voisins ? " + engine._are_neighbour(coord_A1,coord_A3));
}
if(engine._are_opposite_color(coord_A1,coord_A3) === true)
{
    console.log("TEST : ENGINE : ARE OPPOSITE COLOR : A1 et A3 ont-ils des couleurs différents ? " + engine._are_opposite_color(coord_A1,coord_A3));
}
if(engine._are_opposite_color(coord_A2,coord_A3) === false)
{
    console.log("TEST : ENGINE : ARE OPPOSITE COLOR : A2 et A3 ont-ils des couleurs différents ? " + engine._are_opposite_color(coord_A2,coord_A3));
}


console.log("\n");
engine._neighboor_dispo(coord_A2);
if(engine._intersections[coord_A2.hash()].getColor() === color_disponible )
{
    console.log("TEST ENGINE : NEIGHBOUR DISPONIBLE : " + engine._intersections[coord_A2.hash()].getColor() + " La couleur du voisin s'est bien mise à DISPONIBLE"  );
}
console.log("TEST : ENGINE : GET NEIGHBOOR MIDDLE : " + engine._get_neighboor(engine._intersections[coord_D5.hash()]) + " Bonne coordonnées des voisins.");
console.log("TEST : ENGINE : GET NEIGHBOOR TOP : " + engine._get_neighboor(engine._intersections[coord_F1.hash()]) + " Bonne coordonnées des voisins. ");
console.log("TEST : ENGINE : GET NEIBOOR BOTTOM : " + engine._get_neighboor(engine._intersections[coord_A2.hash()]) + " Bonne coordonnées des voisins. ");

