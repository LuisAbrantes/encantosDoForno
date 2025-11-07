// Restaurant Configuration Constants
export const RESTAURANT_CONFIG = {
    name: 'Encantos do Forno',
    location: 'Jacareí/SP',
    phone: '(12) 3961-XXXX',
    email: 'contato@encantosdoforno.com.br',
    whatsapp: 'https://wa.me/5512396100000',
    schedule: {
        weekdays: {
            days: 'Quarta à Sexta',
            hours: '6h30 às 15h'
        },
        weekend: {
            days: 'Sábado e Domingo',
            hours: '7h às 11h e 19h às 22h'
        }
    }
};

// Image Assets
export const IMAGES = {
    hero: '/fogo.jpg',
    placeholder:
        'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070'
};

// Social Media Links
export const SOCIAL_MEDIA = {
    instagram: 'https://www.instagram.com/encantosdofornojcr/',
    facebook:
        'https://www.facebook.com/people/Encantos-do-Forno/61575225126843/',
    whatsapp: RESTAURANT_CONFIG.whatsapp
};

// Restaurant Address
export const ADDRESS = {
    street: 'Avenida Edmundo de Souza, 225',
    neighborhood: 'Jardim América',
    city: 'Jacareí',
    state: 'SP',
    zipCode: '12322-050',
    mapUrl: 'https://www.google.com/maps/search/Avenida+Edmundo+de+Souza+225+Jardim+America+Jacarei+SP+12322050'
};
