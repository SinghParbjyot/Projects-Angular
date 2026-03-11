import { Invoice } from "../models/invoice"

export const invoiceData : any = {
    id:1,
    name: 'Componentes de PC',
    client:{
        name:'Andres',
        lastname:'Doe',
        address:{
            country:'USA',
            city:'Los Angeles',
            street:'One Street',
            number:15,
        }
    },
    company: {
        name:'New Age',
        fiscalNumber:321312,
    },
    items: [{
        id:1,
        product:'Cpu intel i9',
        price: 599,
        quantity:1
        
     },{
        id:2,
        product:'Corsai Teclado Mecanico',
        price: 34,
        quantity:2
        
    },{
        id:3,
        product:'Monitor Asus',
        price: 200,
        quantity:3
        
    },

    ]
    
}