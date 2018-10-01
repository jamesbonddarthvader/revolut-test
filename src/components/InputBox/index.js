import React, { Component } from 'react';
import './styles.scss';
import { Dropdown } from 'semantic-ui-react';

class InputBox extends Component {
	constructor(props) {
		super(props);
		this.handleChangeInput = this.handleChangeInput.bind(this);
		this.handleChangeDropdown = this.handleChangeDropdown.bind(this);
	};
	handleChangeDropdown(e, { value }) {
		this.props.currencyHandler(value, true);
	}
	handleChangeInput(event) {
		this.props.inputHandler(event.target.value);
	}
	render() {
		return (
			<section className="input-box__wrap">
				<div className="input-box__wrap-inner">
					<div className="input-box__flex-container">
						<Dropdown className="input-box__flex-item" placeholder='XXX' defaultValue={this.props.items[0].value} noResultsMessage={null} search selection options={this.props.items} onChange={this.handleChangeDropdown} />
						<input placeholder="0" value={this.props.inputValue} onChange={this.handleChangeInput} className="input-box__input input-box__flex-item" type="number" max="15" />
					</div>
				</div>
			</section>
		);
	}
}

export default InputBox;