import lib from '../../../openxum';

//let c = new lib.OpenXum.Abande.Coordinates.coordinates.Constructor('A',2);
let s = new lib.OpenXum.Abande.Coordinates('A',2);
let c = new lib.OpenXum.Abande.Coordinates('A',2);
let d = new lib.OpenXum.Abande.Coordinates('A',10);

if( s._number === 2) {
    console.log("TRUE");
}

console.log("Coordonnée : " + s.letter() + s.number());

if (s.equals(c))
{
    console.log("Les deux coordonnées "+s.letter()+s.number()+" et "+ c.letter() + c.number() +" sont identiques !! ");
}

if(s.is_valid())
{
    console.log("Les coordonnées sont valident");
}

if(s.verification())
{
    console.log("Verification coordonnée parfaite !");
}