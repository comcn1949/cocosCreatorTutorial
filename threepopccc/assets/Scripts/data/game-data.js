/**
 * Created by chuhaoyuan on 2017/7/6.
 */
import localDataController from './local-data-controller'
import defines from './../defines'
const GameData = function () {
  let that = {};
  that.playerID = 0;
  that.heartCount = 6;
  that.scoreCount = 0;
  that.distanceCount = 0;
  that.energyCount = 0;
  that.totalEnergyCount = 100;
  that.skillList = [];
  that.init = function () {
    that.heartCount = 6;
    that.scoreCount = 0;
    that.distanceCount = 0;
    that.energyCount = 0;
    localDataController.removeLocalData(defines.userKey);
    if (localDataController.getData(defines.userKey) === null){
      let date = new Date();
      let id = date.getTime();
      localDataController.setData(defines.userKey,{playerID: id});
      cc.log("储存用户id");

      //储存一下激活的技能
      let skillList = defines.SkillList[[defines.SkillMap.fireAttack]];
      cc.log("skill list = " + JSON.stringify(skillList));
      localDataController.setData(defines.localStorageKeyMap.EnerySkill,skillList);
    }
    that.playerID = localDataController.getData(defines.userKey).playerID;
    cc.log("用户ID = " + that.playerID);
    that.skillList = localDataController.getData(defines.localStorageKeyMap.EnerySkill);

  };
  that.addScore = function (score) {
    cc.log("add score" + score);
    that.scoreCount += score;
  };
  that.addDistance = function (distance) {
    that.distanceCount += distance;
  };
  that.subHeart = function (count) {
    that.heartCount -= count;
  };
  that.addEnergyCount = function (count,callback) {

    that.energyCount += count;
    if (that.energyCount > that.totalEnergyCount){
      that.energyCount = 0;
      if (callback){
        callback();
        //豆满了
      }
    }
  };
  that.subEnergyCount = function (count) {
    that.energyCount -= count;
  };
  that.getEnergyProgress = function () {
    let value = that.energyCount / that.totalEnergyCount;
    // return that.energyCount / that.totalEnergyCount;
    // cc.log("value = " + value);
    return value;
  }
  return that;
};
export default GameData;