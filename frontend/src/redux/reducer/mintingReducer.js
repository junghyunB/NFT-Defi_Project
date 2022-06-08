let initialState = {
    premintdata : '',
    whitemintdata : '',
    maxNormalTokenCount : '',
    maxSpecialTokenCount : '',
    normalTokenCount : '',
    specialTokenCount : '',
    mymintdata : '',
    allmintdata : ''
}

function mintingReducer(state=initialState,action) {
    let {type, payload} = action
    // console.log(payload)

    switch(type) {
        case "GET_PRE_MINTDATA" :
            return {...state, premintdata : payload.premintdata}

        case "GET_WHITE_MINTDATA" :
            return {...state, whitemintdata : payload.whitemintdata}

        case "GET_ALL_TOKENCOUNT" :
            return {...state,
                maxNormalTokenCount : payload.maxNormalTokenCount,
                maxSpecialTokenCount : payload.maxSpecialTokenCount - 10000,
                normalTokenCount : payload.normalTokenCount,
                specialTokenCount : payload.specialTokenCount - 10000
            }

        case "GET_MY_MINTDATA" :
            return {...state, mymintdata : payload.mymintdata}

        case "GET_ALL_MINTDATA" :
            return {...state, allmintdata : payload.allmintdata}

        default :
            return {...state}
    }
}   

export default mintingReducer