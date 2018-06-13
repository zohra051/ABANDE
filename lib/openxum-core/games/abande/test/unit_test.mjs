import lib from '../../../openxum';

let s = new lib.OpenXum.Abande.Coordinates('A',2);
let d = new lib.OpenXum.Abande.Coordinates('A',4);
let e = new lib.OpenXum.Abande.Coordinates('D',7);
let c = new lib.OpenXum.Abande.Coordinates('A',2);
let p = lib.OpenXum.Abande.Phase.PUT_FIRST_PIECE;
let p2 = lib.OpenXum.Abande.Phase.CAPTURE_PIECE;
let p3 = lib.OpenXum.Abande.Phase.PUT_PIECE;
let col = lib.OpenXum.Abande.Color.BLACK;
let a = new lib.OpenXum.Abande.Move(p,col,s,d);
let a2 = new lib.OpenXum.Abande.Move(p2,col,s,e);
let a3 = new lib.OpenXum.Abande.Move(p3,col,s,d);

if( s._number === 2) {
    console.log("TRUE");
}

console.log("TEST Coordinates : Coordonnée : " + s.letter() + s.number());

if (s.equals(c))
{
    console.log("TEST Coordinates : Les deux coordonnées "+s.letter()+s.number()+" et "+
        c.letter() + c.number() +" sont identiques !! ");
}

if(s.is_valid())
{
    console.log("TEST Coordinates : Les coordonnées sont valident");
}

if(s.verification())
{
    console.log("TEST Coordinates : Verification coordonnée parfaite !");
}

if (a.color() === col)
{
    console.log("TEST Move : Couleur NOIR");
}

if(a.coordinates().letter() ===  s.letter() && a.coordinates().number() === s.number())
{
    console.log("TEST Move : Coordonnée "+ s.letter() + s.number());
}

if(a2.from().letter() === s.letter() && a2.from().number() === s.number())
{
    console.log("TEST Move : Coordonnée from "+ s.letter() + s.number());
}

if(a2.to().letter() === d.letter() && a2.to().number() === d.number())
{
    console.log("TEST Move : Coordonnée to "+ d.letter() + d.number());
}

if(a2.type() === p2)
{
    console.log("TEST Move : Type de "+ d.letter() + d.number() + " est " + p2);
}

console.log("TEST Move : GET : PUT_FIRST_PIECE BLACK A2 => " + a.get());
console.log("TEST Move : GET : CAPTURE_PIECE BLACK A2 D7 => " + a2.get());
console.log("TEST Move : GET : PUT_PIECE BLACK A2 => " + a3.get());

console.log("TEST Move : PARSE : AVANT " + a.get());
if(a.from() !== a2.from() && a.to() !== a2.to())
{
    a.parse("CPBA2D7");
    console.log("TEST Move : PARSE : APRES " + a.get());
}

console.log("TEST Move : TO_STRING : " + a2.to_string());



