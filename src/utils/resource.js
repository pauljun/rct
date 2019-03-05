import _ from 'lodash'
import {toJS} from 'mobx'

/**
 * @desc 人脸查询条件处理
 * @param {Object} options 
 */
export const faceOptions = options => {
  const { limit, startTime, endTime, cameraIds, sex, eyeGlass, placeType, minId, generation } = options
  let sexOtherTags = undefined
  let sexTags = undefined
  if(sex === 'other'){
    sexOtherTags = Dict.map.sex.filter(item => item.value !== 'other').map(v => v.value)
  }
  sexTags = sexOtherTags ? sexTags : (sex ? [sex] : [])
  let data = {
    limit,
    startTime,
    endTime,
    sexTags,
    sexOtherTags,
    placeTags: toJS(placeType) || [],
    cids: cameraIds.map(v => v.cid || v.id)
  }
  if(minId){
    data.minId = minId
  }
  if(generation){
    data.ageSectionTags = [generation]
  }
  if(eyeGlass === '112802'){
    data.noGlassTags = ['112801']
  }else{
    data.glassTags = eyeGlass ? [eyeGlass] : []
  }
  return data
}

export const bodyOptions = options => {
  const { generation, limit, startTime, endTime, cameraIds, sex, placeType, upColor, lowerColor, head, goods, upperTexture, lowerTexture, nation, minId } = options
  let sexOtherTags = undefined
  let sexTags = undefined
  if(sex === 'other'){
    sexOtherTags = Dict.map.sex.filter(item => item.value !== 'other').map(v => v.value)
  }
  sexTags = sexOtherTags ? sexTags : (sex ? [sex] : [])
  let wearColorTags = []
  if (upColor) { wearColorTags.push(upColor) }
  if (lowerColor) { wearColorTags.push(lowerColor) }
   var data = {
    limit,
    endTime,
    sexTags,
    sexOtherTags,
    bottomsTypeTags: lowerTexture ? [lowerTexture] : [],
    topsTextureTags: upperTexture ? [upperTexture] : [],
    personalEffectsTags: goods ? [goods] : [],
    wearColorTags,
    headTags: head ? [head] : [],
    startTime,
    cids: cameraIds.map(v => v.cid || v.id),
    placeTags: toJS(placeType) || []
   }
   if(generation){
    data.ageSectionTags = [generation]
   }
   if(minId){
    data.minId = minId
  }
   return data
}

/**
 * @desc 机动车查询条件处理
 * @param {Object} options 
 */
export const vehicleOptions = options => {
  const { 
    offset,
    limit,
    plateNo,
    startTime,
    endTime,
    cameraIds,
    plateColor,
    vehicleBrands,
    vehicleClasses,
    vehicleColor,
    minId
  } = options
  let includeTags = []
  if(plateColor) { includeTags.push(plateColor) }
  if(vehicleBrands) { includeTags.push(vehicleBrands) }
  if(vehicleClasses) { 
    let ids = Dict.map.vehicleClasses.filter(v => v.value === vehicleClasses)[0].ids
    includeTags = includeTags.concat(ids) 
  }
  if(vehicleColor) { includeTags.push(vehicleColor) }
  return options = {
    limit,
    //offset,
    startTime,
    plateNo,
    endTime,
    includeDeviceIds: cameraIds.map(v => v.id),
    includeTags,
    minId
  }
}