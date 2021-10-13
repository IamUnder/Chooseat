const namespaced = true;

const state = {
    id: null,
    name: null,
    email: null,
    roomCode: null
}

const mutations = {
    SET_USER_DATA: (state, payload) => {
        state.id = payload.id
        state.name = payload.name
        state.email = payload.email
        state.roomCode = payload.roomCode
    },
    SET_ROOM: (state, payload) => {
        state.roomCode = payload
    }
}

const actions = {
    setUserData(context, userData) {
        context.commit('SET_USER_DATA', userData)
    },
    setRoom(context, id) {
        context.commit('SET_ROOM', id)
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