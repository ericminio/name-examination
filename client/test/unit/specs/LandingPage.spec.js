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
        let sentMessage;
        beforeEach(()=>{
            store = {
                getters: {
                    isAuthenticated:true,
                    dashboardData: {
                        priorityRequestCount:42,
                        days: [
                            { date:'October 31', count:125 },
                            { date:'October 30', count:25 }
                        ]
                    }
                },
                dispatch:function(message) {
                    sentMessage = message;
                }
            };
            const Constructor = Vue.extend(LandingPage);
            vm = new Constructor({store:store}).$mount(document.getElementById('app'));
        })
        it('renders welcome page', () => {
            expect(vm.$el.querySelector('h3').textContent).toContain('Welcome to Name X!');
        })

        it('displays priority requests count', () => {
            expect(vm.$el.querySelector('#priority-requests-count').textContent).toContain('42');
        })
        it('displays first day count', () => {
            expect(vm.$el.querySelector('#day-1 .date').textContent).toContain('October 31');
            expect(vm.$el.querySelector('#day-1 .count').textContent).toContain('125');
        })
        it('displays second day count', () => {
            expect(vm.$el.querySelector('#day-2 .date').textContent).toContain('October 30');
            expect(vm.$el.querySelector('#day-2 .count').textContent).toContain('25');
        })
        it('displays total', () => {
            expect(vm.$el.querySelector('#total').textContent).toContain('150');
        })

        describe('refresh button', ()=>{

            it('triggers reload', ()=>{
                let button = vm.$el.querySelector('#refresh');
                let window = button.ownerDocument.defaultView;
                var click = new window.Event('click');
                button.dispatchEvent(click);

                expect(sentMessage).toEqual('getDashboardData');
            })
        })

        describe('resists empty data', ()=>{
            let store;
            let vm;
            let sentMessage;
            beforeEach(()=>{
                store = {
                    getters: {
                        isAuthenticated:true,
                        dashboardData: {
                            priorityRequestCount:0,
                            days: []
                        }
                    },
                    dispatch:function(message) {
                        sentMessage = message;
                    }
                };
                const Constructor = Vue.extend(LandingPage);
                vm = new Constructor({store:store}).$mount(document.getElementById('app'));
            })

            it('displays priority requests count', () => {
                expect(vm.$el.querySelector('#priority-requests-count').textContent).toContain('0');
            })
            it('does not displays day count', () => {
                expect(vm.$el.querySelector('#day-1')).toEqual(null);
            })
            it('displays total', () => {
                expect(vm.$el.querySelector('#total').textContent).toContain('0');
            })
        })
    })
});
