/* eslint-disable */
import Vue from 'vue';
import LandingPage from '@/components/LandingPage';
import store from '@/store'

describe('LandingPage.vue', () => {

    it('renders warning message when not connected', () => {
        const Constructor = Vue.extend(LandingPage);
        const vm = new Constructor({store:store}).$mount();
        expect(vm.$el.querySelector('h2').textContent)
            .toEqual('Your authorization is missing or has expired. Please login.');
    });

    describe('when authenticated', ()=>{

        let store;
        let vm;
        beforeEach(()=>{
            store = {
                getters: {
                    isAuthenticated:true,
                    statsDataJSON: {
                        draft: {
                            response: {
                                numFound: 3
                            }
                        },
                        hold: {
                            response: {
                                numFound: 5
                            }
                        }
                    }
                }
            };
            const Constructor = Vue.extend(LandingPage);
            vm = new Constructor({store:store}).$mount();
        })
        it('renders welcome page', () => {
            expect(vm.$el.querySelector('h3').textContent).toContain('Welcome to Name X!');
        })
        it('displays not examined count', () => {
            expect(vm.$el.querySelector('.card-body').textContent).toContain('Not Examined: 3');
        })
        it('displays hold count', () => {
            expect(vm.$el.querySelector('.card-body').textContent).toContain('Hold: 5');
        })
    })

});
