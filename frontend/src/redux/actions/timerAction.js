import api from '../api'

function timerAct(gamePointRank, airdropReward) {
    return async (dispatch) => {
        console.log("액션 잘 됩니다")
        console.log("1등 계정 : ", gamePointRank[0].account)
        console.log("2등 계정 : ", gamePointRank[1].account)
        console.log("3등 계정 : ", gamePointRank[2].account)
        console.log("1등 airdrop edition : ", airdropReward[0])
        console.log("2등 airdrop edition : ", airdropReward[1])
        console.log("3등 airdrop edition : ", airdropReward[2])

        try {
            const timerApi = await api.post("/airdropapprove")
            console.log(timerApi)

            if(timerApi.status){
                console.log("왔냐?")
                const response = api.post("/airdrop", {
                  firstaccount : gamePointRank[0].account, 
                  secondaccount : gamePointRank[1].account, 
                  thirdaccount : gamePointRank[2].account, 
                  firstedition : airdropReward[0], 
                  secondedition : airdropReward[1], 
                  thirdedition : airdropReward[2]
                })

                console.log("에어드랍성공")
            }
        }
        catch(error) {
            console.error(error)
        }
    }
}

export const timerAction = {timerAct}