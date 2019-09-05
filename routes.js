define([], function() {
    return [
        {
            path: '/',
            component: view('home')
        },
        {
            path: '/contact-us',
            component: view('default'),
            children: [
                {
                    path: '',
                    component: view('contact'),
                    name: 'contactUs'
                }
            ]
        },
        {
            path: '/events',
            component: view('default'),
            children: [
                {
                    path: '',
                    component: view('events'),
                    name: 'eventList'
                },
                {
                    path: ':id',
                    component: view('event_details'),
                    name: 'eventDetails',
                    props: true
                }
            ]
        },
        {
            path: '/jobs',
            component: view('default'),
            children: [
                {
                    path: '',
                    component: view('jobs'),
                    name: 'jobList'
                },
                {
                    path: ':id',
                    component: view('job_details'),
                    name: 'jobDetails',
                    props: true
                }
            ]
        },
        {
            path: '/leasing-opportunities',
            component: view('default'),
            children: [
            	{
	                path: '',
	                component: view('page_details'),
                    name: 'pageDetails'
            	}
            ]
        },
        {
            path: '/map',
            component: view('default'),
            redirect: '/404',
            children: [
            	{
                	path: '',
                	component: view('map'),
                	name: 'map'
            	}
            ]
        },
        {
            path: '/news',
            component: view('default'),
            children: [
            	{
                    path: '',
                    component: view('news'),
                    name: 'newsList'
                },
                {
                    path: ':id',
                    component: view('news_details'),
                    name: 'newsDetails',
                    props: true
                }
            ]
        },
        {
            path: '/newsletter',
            component: view('default'),
            children: [
            	{
	                path: '',
	                component: view('newsletter'),
	                name: 'newsletter'
            	}
        	]
        },
        {
            path: '/overview',
            component: view('default'),
            children: [
                {
                    path: '',
                    component: view('page_details'),
                    name: 'pageDetails'
                }
            ]
        },
        {
            path: '/pages',
            component: view('default'),
            redirect: '/404',
            children: [
                {
                    path: ':id',
                    component: view('page_details'),
                    name: 'pageDetails'
                }
            ]
        },
        {
            path: '/promotions',
            component: view('default'),
            children: [
                {
                    path: '',
                    component: view('promotions'),
                    name: 'promoList'
                },
                {
                    path: ':id',
                    component: view('promotion_details'),
                    name: 'promotionDetails',
                    props: true
                }
            ]
        },
        {
            path: '/stores',
            component: view('default'),
            children: [
                {
                    path: '',
                    component: view('stores'),
                    name: 'storeList'
                },
                {
                    path: ':id',
                    component: view('store_details'),
                    name: 'storeDetails',
                    props: true
                }
            ]
        },
        {
            path: '*',
            redirect: '/'
        }
    ]

    /**
     * Asynchronously load view (lazy-loading)
     * @param {string} name the filename (basename) of the view to load.
     */
    function view(name) {
        return function(resolve) {
            require(['vue!' + name + '.vue'], resolve);
        }
    };
});