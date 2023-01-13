import { createRouter, createWebHistory } from 'vue-router'
import Header from './components/Header.vue'
import Hero from './components/Hero.vue'
import SectionOne from './components/Section-1.vue'
import Form from './components/Form.vue'
import Footer from './components/Footer.vue'
import Home from './views/Home.vue'
import Dashboard from './views/Dashboard.vue'

export default createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: () => Home,
            children: [
                {
                    path: '',
                    components: {
                        Header: Header,
                        Hero: Hero,
                        SectionOne: SectionOne,
                        Footer: Footer,
                    }
                },
            ]
        },

        {
            path: '/dashboard',
            component: () => Dashboard,
            children: [
                {
                    path: '',
                    components: {
                        Header: Header,
                        Form: Form,
                    }
                },
            ]
        },
    ],
})
