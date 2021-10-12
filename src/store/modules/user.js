const namespaced = true;

const state = {
    id: null,
    name: null,
    email: null,
    partnerId: null
}

const mutations = {
    SET_USER_DATA: (state, payload) => {
        state.id = payload.id
        state.name = payload.name
        state.email = payload.email
        state.partnerId = payload.partnerId
    },
    SET_PARTNER: (state, payload) => {
        state.partnerId = payload
    }
}

const actions = {
    setUserData(context, userData) {
        context.commit('SET_USER_DATA', userData)
    },
    setPartner(context, id) {
        context.commit('SET_PARTNER', id)
    }
}

const getters = {

}

export default {
    namespaced,
    state,
    mutations,
    actions,
    getters
}