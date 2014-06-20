module.exports = {
  config: {
    defaultUrlCode: 'd'
  },
  individual: {
    displayName: 'Individual',
    slug: 'individual',
    categories: [
      {
        displayName: 'Vehicle',
        slug: 'vehicle',
        icon: '',
        views: ['defaultView', 'carView', 'boatView', 'ecarView', 'motorcycleView'],
      },
      {
        displayName: 'Public Transortation',
        slug: 'transport',
        icon: '',
        views: ['defaultView']
      },
      {
        displayName: 'Air Travel',
        slug: 'air',
        icon: '',
        views: ['defaultView','add','average','list']
      },
      {
        displayName: 'Home Energy',
        slug: 'home',
        icon: '',
        views: ['defaultView','add']
      }
    ]
  },
  business:  {
    displayName: 'Business',
    slug: 'business',
    categories: [
      {
        displayName: 'Site',
        slug: 'site',
        icon: '',
        views: []
      },
      {
        displayName: 'Fleet',
        slug: 'fleet',
        icon: '',
        views: []
      },
      {
        displayName: 'Air Travel',
        slug: 'air',
        icon: '',
        views: []
      },
      {
        displayName: 'Commute',
        slug: 'commute',
        icon: '',
        views: []
      },
      {
        displayName: 'Shipping',
        slug: 'shipping',
        icon: '',
        views: []
      }
    ]
  },
  events: {
    displayName: 'Events',
    slug: 'events',
    categories: [
      {
        displayName: 'Site',
        slug: 'site',
        icon: '',
        views: []
      },
      {
        displayName: 'Driving',
        slug: 'driving',
        icon: '',
        views: []
      },
      {
        displayName: 'Flights',
        slug: 'flights',
        icon: '',
        views: []
      }
    ]
  }
}

