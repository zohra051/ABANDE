import lib from '../../../openxum';

let coord_A1 = new lib.OpenXum.Abande.Coordinates('A',1);
let coord_A2 = new lib.OpenXum.Abande.Coordinates('A',2);
let coord_A2bis = new lib.OpenXum.Abande.Coordinates('A',2);
let coord_A3 = new lib.OpenXum.Abande.Coordinates('A',3);
let coord_A4 = new lib.OpenXum.Abande.Coordinates('A',4);
let coord_B2 = new lib.OpenXum.Abande.Coordinates('B',2);
let coord_B3 = new lib.OpenXum.Abande.Coordinates('B',3);
let coord_B4 = new lib.OpenXum.Abande.Coordinates('B',4);
let coord_B5 = new lib.OpenXum.Abande.Coordinates('B',5);
let coord_C2 = new lib.OpenXum.Abande.Coordinates('C',2);
let coord_C3 = new lib.OpenXum.Abande.Coordinates('C',3);
let coord_C4 = new lib.OpenXum.Abande.Coordinates('C',4);
let coord_C5 = new lib.OpenXum.Abande.Coordinates('C',5);
let coord_D7 = new lib.OpenXum.Abande.Coordinates('D',7);
let coord_D5 =  new lib.OpenXum.Abande.Coordinates('D',5);
let coord_F5 = new lib.OpenXum.Abande.Coordinates('F',5);
let coord_G5 = new lib.OpenXum.Abande.Coordinates('G',5);

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

engine._reset();
engine._put_first_piece(color_black,coord_A2);
engine._put_piece(color_white,coord_A1);
engine._put_piece(color_black,coord_A3);
engine._put_piece(color_white,coord_B4);
engine._put_piece(color_black,coord_B2);

if(engine._can_capture(coord_B4,coord_A3) === true)
{
    console.log("TEST : ENGINE : CAN CAPTURE : B4 peut-il capturer A3 "+ engine._can_capture(coord_B4,coord_A3));
}

if(engine._can_capture(coord_A3,coord_B4) === false)
{
    console.log("TEST : ENGINE : CAN CAPTURE : A3 peut-il capturer B4 "+engine._can_capture(coord_A3,coord_B4));
}

console.log("PLATEAU : \t B2    B4 \n" +
    "\t \t \t A1 A2 A3 ");
engine._capture_piece(color_white,coord_B4,coord_A3);

if(engine._intersections[coord_B3.hash()].getColor() === color_disponible &&
    engine._intersections[coord_C4.hash()].getColor() === color_none &&
    engine._intersections[coord_C5.hash()].getColor() === color_none &&
    engine._intersections[coord_B5.hash()].getColor() === color_none &&
    engine._intersections[coord_A4.hash()].getColor() === color_disponible)
{
    console.log("TEST : ENGINE : CAPTURE PIECE : Capture B4 vers A3 réussit !"    );
}


engine._capture_piece(color_black,coord_A2,coord_A1);


console.log(engine._intersections[coord_B3.hash()].getColor());

if(engine._intersections[coord_A1.hash()].getColor() === color_white &&
    engine._intersections[coord_A2.hash()].getColor() === color_black &&
    engine._intersections[coord_B2.hash()].getColor() === color_black &&
    engine._intersections[coord_A3.hash()].getColor() === color_white &&
    engine._intersections[coord_B3.hash()].getColor() === color_disponible)
{
    console.log("TEST : ENGINE : CAPTURE PIECE : Capture de A2 vers A1 invalide ! ");
}

/*
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

/*************************************************************************************************************/
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
console.log(engine._get_neighboor_top(coord_F5.hash()));
let list_bonne_top = engine._get_neighboor_top(coord_F5.hash());
let test = [ 27, 26, 32, 39 ];
for(let i = 0 ; i < test.length;i++)
{
    if(list_bonne_top[i] === test[i])
    {
        console.log("TEST : ENGINE : NEIGHBOOR TOP : Tableau des voisins de F5 => "+ list_bonne_top[i]);
    }
}
console.log(engine._get_neighboor_bottom(coord_A2.hash()));
let list_bonne_bottom = engine._get_neighboor_bottom(coord_A2.hash());
let test2 = [ 0, 8, 14, 15 ];
for(let i = 0 ; i < test2.length;i++)
{
    if(list_bonne_bottom[i] === test2[i])
    {
        console.log("TEST : ENGINE : NEIGHBOOR BOTTOM : Tableau des voisins de A2 => "+ list_bonne_bottom[i]);
    }
}
console.log(engine._get_neighboor_middle(coord_D5.hash()));
let list_bonne_middle = engine._get_neighboor_middle(coord_D5.hash());
let test3 = [ 23, 24, 25, 30, 32, 38 ]
for(let i = 0 ; i < test3.length;i++)
{
    if(list_bonne_middle[i] === test3[i])
    {
        console.log("TEST : ENGINE : NEIGHBOOR BOTTOM : Tableau des voisins de D5 => "+ list_bonne_middle[i]);
    }
}
//console.log(engine.intersection());
//
engine._put_piece(color_white,coord_A4);
//console.log(engine.intersection());
console.log("TEST : ENGINE : NO HOLE : A1 A2 A3 A4 => Déplacement de A4 vers A3 autorisé ? => " + engine._no_hole(coord_A4,coord_A3));
console.log("TEST : ENGINE : NO HOLE : A1 A2 A3 A4 => Déplacement de A2 vers A3 autorisé ? => " + engine._no_hole(coord_A2,coord_A3));

console.log("\n");
if(engine._hash_exist(coord_G5.hash()) === false)
{
    console.log("TEST : ENGINE : HASH EXIST :  La case G5 existe t-elle ? " + engine._hash_exist(coord_G5.hash()) );
}

if(engine._hash_exist(coord_A2.hash()) === true)
{
    console.log("TEST : ENGINE : HASH EXIST :  La case A2 existe t-elle ? " + engine._hash_exist(coord_A2.hash()) );
}

engine._dormant();
//console.log(engine.intersection());
if(engine._intersections[coord_A3.hash()].getColor() === -1)
{
    console.log("TEST : ENGINE : DORMANT : Ya-t-il des dormants ? A3 "+ lib.OpenXum.Abande.Color.display(engine._intersections[coord_A3.hash()].getColor()) );
}

engine._reset();

engine._put_piece(color_black,coord_A2);
engine._put_piece(color_white,coord_A1);
engine._put_piece(color_black,coord_A3);
engine._put_piece(color_white,coord_A4);
engine._put_piece(color_black,coord_B3);
engine._put_piece(color_white,coord_B2);
engine._put_piece(color_black,coord_C4);
engine._put_piece(color_white,coord_C3);
engine._put_piece(color_black,coord_D5);
engine._put_piece(color_white,coord_C2);
engine._put_piece(color_black,coord_C5);

let listeee = engine._count_score();
if( listeee[color_white] === 4)
{
    console.log("TEST : ENGINE : COUNT SCORE : " + lib.OpenXum.Abande.Color.display(color_white) +" "+ listeee[color_white]);
}
if( listeee[color_black] === 4)
{
    console.log("TEST : ENGINE : COUNT SCORE : " + lib.OpenXum.Abande.Color.display(color_black) +" "+ listeee[color_black]);
}