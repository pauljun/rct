export default function searchList(types){
  const searchList = [
    {
      type:'AlarmTimeTypeSelect',
      component: Loader.loadBusinessComponent(
        'BaseLibComponents',
        'AlarmTimeTypeSelect'
      )
    },
    {
      type:'AlarmStateSelect',
      component: Loader.loadBusinessComponent(
        'BaseLibComponents',
        'AlarmStateSelect'
      )
    },
    {
      type:'AlarmSiteScreening',
      component: Loader.loadBusinessComponent(
        'BaseLibComponents',
        'AlarmSiteScreening'
      )
    },
    {
      type:'AlarmTimeRadio',
      component: Loader.loadBusinessComponent(
        'BaseLibComponents',
        'AlarmTimeRadio'
      )
    }
  ]
  return searchList.filter(v => types.includes(v.type))
}