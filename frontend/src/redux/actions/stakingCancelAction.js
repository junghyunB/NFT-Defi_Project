import { caver, STAKING_CONTRACT_ADDRESS, StakingContract } from "../../caverConfig";

function stakingCancelAct(account, edition) {

    console.log(account)
    console.log(edition)

    return async (dispatch) => {
        try {
            const response = await caver.klay.sendTransaction({
                from: account,
                to: STAKING_CONTRACT_ADDRESS,
                gas: "3000000",
                data: StakingContract.methods.unstake(edition).encodeABI()
            })
            console.log(response);
          } catch (error){
            console.error(error);
          }
    }
}

export const stakingCancelAction = {stakingCancelAct}