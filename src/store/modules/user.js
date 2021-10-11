const namespaced = true;

const state = {
    id: null,
    name: null,
    email: null
}

const mutations = {
    SET_USER_DATA: (state, payload) => {
        state.id = payload.id
        state.name = payload.name
        state.email = payload.email
    }
}

const actions = {
    setUserData(context, userData) {
        context.commit('SET_USER_DATA', userData)
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