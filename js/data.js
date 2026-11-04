export const lang = ["Español", "Catalán", "Inglés", "Alemán", "Italiano", "Francés", "Portugués", "Japonés", "Árabe", "Chino"];
export const levels = ["A1", "A2", "B1", "B2", "C1", "C2", "Nativo"];
export const type = ["Presencial", "En línia"];

export const users = [
    {id: 1, name: "Dafler", email: "dafler@dafler.com", password: "1234", nativeLang: "Catalán", city: "Barcelona"},
    {id: 2, name: "Florian", email: "florian@dafler.com", password: "1234", nativeLang: "Español", city: "Barcelona"},
    {id: 3, name: "Daniel", email: "daniel@dafler.com", password: "1234", nativeLang: "Español", city: "Girona"},
    {id: 4, name: "Erik", email: "erik@dafler.com", password: "1234", nativeLang: "Catalán", city: "Tarragona"}
];

// Tipo "offer" -> Oferta (Tu das el servicio) | Tipo "petition" -> Petición (Necesitas aprender)
export const exchanges = [
    {id: 1, service: "Oferta", lang: "Catalán", level: "Nativo", type: "Presencial", user: "Daniel", title: "Ofrezco catalán solo por la mañana", description: "Quedariamos en la biblioteca cerca de la universidad de Girona para hacer clases de 1h.", date: "18-10-26"},
    {id: 2, service: "Oferta", lang: "Español", level: "Nativo", type: "En línia", user: "Florian", title: "Ofrezco español 1h de 10h a 14h", description: "Las clases durarían una hora y seerían a través de google meet.", date: "19-10-26"},
    {id: 3, service: "Oferta", lang: "Inglés", level: "B2", type: "Presencial", user: "Erik", title: "Ofrezco inglés de lunes a viernes todas las tardes.", description: "Quedariamos en la biblioteca cerca de la universidad de Tarragona para hacer clases de 1h.", date: "18-10-26"},
    {id: 4, service: "Petición", lang: "Italiano", level: "B1", type: "En línia", user: "Erik", title: "Tengo un examen de italiano", description: "Necesito aprender italiano en un B2 para poder presentarme al examen, puedo todas las tardes de 16h a 20h.", date: "18-10-26"}
];