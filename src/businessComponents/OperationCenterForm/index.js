/**
 * @title 添加/编辑应用系统信息
 * @author wwj
 */

import React from 'react'
import { Button, Input, Form, message, Popover, Icon } from 'antd'
import { withRouter } from 'react-router-dom'
import LingMou from 'src/assets/img/login/Logo.svg'
import Logo_Antelope from 'src/assets/img/operation/Logo_Antelope.svg'
import Logo_DeepCloud from 'src/assets/img/operation/Logo_DeepCloud.svg'
import './index.less'

const MapZoomCenter = Loader.loadBusinessComponent('MapComponent', 'ZoomCenter')
const IconFont = Loader.loadBaseComponent('IconFont')
const Upload = Loader.loadBaseComponent('UploadComponents', 'FormUpload')

const FormItem = Form.Item

const noticeLogo = (
	<div className='notice-item sys-logo'>
		<div className='ex'>
			<img src={LingMou} />
		</div>
		<div className='ec'>
			<p>1、尺寸: 长宽比为1:1,最好为64*64px</p>
			<p>2、配色: Logo主色调为亮色,背景模糊,保证在深色背景上的识别度</p>
			<p>3、格式: SVG, PNG</p>
		</div>
	</div>
)

const noticepartnerLogoUrl = (
	<div className='notice-item co-logo-popover'>
		<div className='t-con'>
			<div className='t1'>
				<div>单个Logo:</div>
				<img src={Logo_Antelope} />
			</div>
			<div className='t2'>
				<div>多个Logo:</div>
				<img style={{marginRight: '20px'}} src={Logo_Antelope} />
				<img src={Logo_DeepCloud} />
			</div>
		</div>
		<div>
			<p>1、尺寸: 高度为40像素,宽度不限</p>
			<p>2、配色: 请上传颜色为冰蓝色(#B2BFD9), 背景透明图片</p>
			<p>3、格式: SVG, PNG</p>
		</div>
	</div>
)

@withRouter
@Decorator.businessProvider('operation', 'tab', 'user')
@Form.create()
class view extends React.Component {
	constructor(props){
		super(props)
	}
	state = {
		loading: false
	}
	baseUrl = `${window.location.origin}/login/`
	
	/**
	 * @desc 表单提交
	 */
	submit() {
		const { form, tab, submit } = this.props
		form.validateFields((err, values) => {
			if (err) {
				return false
			}
			const { 
				operationCenterName,  
				contactPerson,
				contactPhone,
				loginName,
				mobile,
				systemLogoUrl,
				partnerLogoUrl,
				loginKeyUrl
			} = values
			const params = {
				isCheckPhoneNumber: 1,
				operationCenterName,
				contactPerson,
				contactPhone,
				userInfo: {
					loginName,
					mobile
				},
				systemLogoUrl,
				partnerLogoUrl,
				loginKeyUrl,
				zoomLevelCenter: this.zoom,
				centerPoint: this.centerPoint
			}
			submit(params)
				.then(() => {
					tab.closeCurrentTab({ history: window.ReactHistory })
				})
		})
	}

	/**
	 * @desc 地图选位确定
	 * @param {Object} info 
	 */
	onOk(info) {
		this.zoom = info.zoom
		this.centerPoint = `${info.center.lng},${info.center.lat}`
	}

	Pointparse = (point) => {
		let arr = point.split(',')
		return [arr[0] * 1, arr[1] * 1]
	}

	async componentDidMount() {
		const { form, data = {}, type = 'add' } = this.props
		/**如果是编辑, form表单写入值 */
		if (type === 'edit') {
			this.zoom = data.zoomLevelCenter
			this.centerPoint = data.centerPoint
			form.setFieldsValue({
				operationCenterName: data.operationCenterName,
				contactPerson: data.contactPerson,
				contactPhone: data.contactPhone || '',
				systemLogoUrl: data.systemLogoUrl,
				loginName: data.userInfo && data.userInfo.loginName,
				systemName: data.systemName,
				loginKeyUrl: data.loginKeyUrl,
				partnerLogoUrl: data.partnerLogoUrl,
				partnerLogoUrlDefault: `${this.baseUrl}${data.loginKeyUrl}`,
				isCheckPhoneNumber: data.isCheckPhoneNumber ? true : false,
				mobile: data.mobile
			})
		}
	}

	/**复制url */
	async copy() {
		let partnerLogoUrl = await this.props.form.getFieldValue('loginKeyUrl')
		this.props.form.setFieldsValue({
			partnerLogoUrlDefault: `${this.baseUrl}${partnerLogoUrl || ''}`,
		}, () => {
			var Url2 = document.getElementById("partnerLogoUrlDefault")
			Url2.select()
			document.execCommand("copy")
			message.success("复制成功!")
		})
	}

	changeheadImg = url => {
		this.systemLogoUrl = url
	}

	/**上传组件内容 */
	uploadComonent(type) {
		return <div className={'logo-bg ' + type}>
			<IconFont type='icon-AddImg_Light' />
		</div>
	}

  /**重置密码 */
  resetPsw = () => {
		this.setState({ resetLoading: true })
		this.props.resetPassword()
			.then(() => {
				this.setState({ resetLoading: false })
			})
  }

	/**取消 */
	cancelBack = () => {
		const { changeModel, tab } = this.props
		if(changeModel){
			changeModel()
		}else{
			tab.closeCurrentTab({ history: window.ReactHistory })
		}
	}
	render() {
		const { getFieldDecorator } = this.props.form
		const { type = 'add', resetPassword } = this.props
		const zoomLevelCenter = {
			zoom: this.zoom,
			center: this.centerPoint ? this.Pointparse(this.centerPoint) : null
		}
		return (
			<React.Fragment>
				<div className='operation-center-form'>
					<Form>
						<h3>
							基本信息
							{type === 'edit' && <Button 
								className='fr'
								type="primary" 
								loading={this.state.resetLoading}
								onClick={this.resetPsw}
							>
								重置密码
							</Button>}
						</h3>
						<FormItem label="应用系统名称 :">
							{getFieldDecorator('operationCenterName', {
								rules: [{ required: true, message: '应用系统名称必须填写' }]
							})(<Input maxLength="30" placeholder="请填写应用系统名称" />)}
						</FormItem>
						<FormItem label="联系人姓名 :">
							{getFieldDecorator('contactPerson')(
								<Input autoComplete="off" maxLength="50" type="text" placeholder="请输入联系人姓名" />
							)}
						</FormItem>
						<FormItem label="联系人电话 :">
							{getFieldDecorator('contactPhone', {
								rules: [
									{
										validator(rule, value, callback, source, options) {
											var errors = []
											if (!/^(1)\d{10}$/.test(value) && value) {
												errors[0] = '请输入正确的手机号码'
											}
											callback(errors)
										}
									}
								]
							})(<Input type="text" autoComplete="off" placeholder="请输入联系人电话" />)}
						</FormItem>
						<h3>账号设置</h3>
						<FormItem label="登录账号 :" >
							{getFieldDecorator('loginName', {
								rules: [
									{
										required: true,
										message: '请输入应用系统超级管理员登录账号'
									}
								]
							})(<Input type="text" disabled={type === 'add' ? false : true} placeholder="请填写登录账号" />)}
						</FormItem>
						<FormItem label="登录手机号 :" type="phone">
							{getFieldDecorator('mobile', {
								rules: [
									{ required: true, message: '请输入手机号码' },
									{
										validator(rule, value, callback, source, options) {
											var errors = []
											if (!/^(1)\d{10}$/.test(value) && value) {
												errors[0] = '请输入正确的手机号码'
											}
											callback(errors)
										}
									}
								]
							})(<Input maxLength="11" placeholder="请输入手机号码" />)}
						</FormItem>
						<FormItem label="系统地图展示层级 :" >
							<div className='map-container'>
								{/* <MapPointLabel
									mapChange={this.onOk.bind(this)}
									zoomLevelCenter={zoomLevelCenter}
								/> */}
								<MapZoomCenter 
									mapChange={this.onOk.bind(this)}
									zoomCenter={zoomLevelCenter}
								/>
							</div>
						</FormItem>
						<h3>登录页</h3>
						<FormItem 
							label="系统logo" 
						>
							<div className='sys-logo logo-s'>
								<div className='fl'>
									{getFieldDecorator('systemLogoUrl', {
										rules: [{ required: true, message: '请上传系统logo' }],
									})(<Upload 
										name="systemLogoUrl" 
										changeheadImg={this.changeheadImg}
										childView={() => this.uploadComonent('w64')} 
										support='svg' />
									)}
								</div>
								<Popover
									placement="right"
									trigger="hover"
									content={noticeLogo}
									overlayClassName='system-popover'
								>
									<div className='fl' style={{marginTop: '10px'}}>
										<Icon type="question-circle" theme="filled" />
									</div>
								</Popover>
							</div>
						</FormItem>
						<FormItem label="合作单位logo" >
							<div className='cooperation-u-logo logo-s'>
								<div className='fl'>
									{getFieldDecorator('partnerLogoUrl')(
										<Upload 
											name="partnerLogoUrl" 
											childView={() => this.uploadComonent('h44')} 
											support='svg' />
									)}
								</div>
								<div className='fl'>
									<Popover
										placement='right'
										trigger='hover'
										content={noticepartnerLogoUrl}
										overlayClassName='system-popover'
									>
										<Icon type="question-circle" theme="filled" />
									</Popover>
								</div>
							</div>
						</FormItem>
						<FormItem label="应用系统URL :" >
							<div name='loginKeyUrl' className='copy-btn url-item'>
								<span>{this.baseUrl}</span>
								{getFieldDecorator('loginKeyUrl', {
									rules: [
										{
											validator(rule, value, callback) {
												var errors = []
												if (/[^a-zA-Z0-9]/g.test(value) && value) {
													errors[0] = '请输入10个字符以内的字母或数字'
												}
												callback(errors)
											}
										}
									]
								})(
									<Input maxLength="10" placeholder="请输入字母或数字" />
								)}
								<Button
									onClick={this.copy.bind(this)}
								>
									<IconFont type='icon-Version_Main' />
									复制链接
								</Button>
								<span className='notice'>请记录此URL, URL设置成功后该应用系统用户需由此地址登录!</span>
							</div>
						</FormItem>
						<FormItem 
							label="应用系统URL :" 
							className='hidden'
						>
							{getFieldDecorator('partnerLogoUrlDefault')(
								<Input
									type='text'
									id='partnerLogoUrlDefault'
								/>
							)}
						</FormItem>
					</Form>
					<div className='sub-group'>
						<Button onClick={this.cancelBack}>
							取消
						</Button>
						<Button 
							type="primary" 
							onClick={this.submit.bind(this)}
						>
							保存
						</Button>
					</div>
				</div>
			</React.Fragment>
		)
	}
}

export default view