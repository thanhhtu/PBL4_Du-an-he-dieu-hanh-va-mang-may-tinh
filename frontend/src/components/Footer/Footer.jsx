import React from 'react';
import './Footer.css';
import logo from '../assets/logo.png';

const Footer = () => {
	return (
		<div className='footer'>
			<div className='footer-logo'>
				<img src= {logo} alt=''></img>
				<p>TT SHOP</p>
			</div>
			<ul className='footer-links'>
				<li><a href='#'>Company</a></li>
				<li><a href='#'>Product</a></li>
				<li><a href='#'>Offices</a></li>
				<li><a href='#'>About</a></li>
				<li><a href='#'>Contact</a></li>
			</ul>
			<div className='footer-social-icon'>
				<a href='#'><i className='fa-brands fa-instagram' /></a>
				<a href='#'><i className='fa-brands fa-pinterest' /></a>
				<a href='#'><i className='fa-brands fa-facebook-f' /></a>
			</div>
			<div className='footer-copyright'>
				<hr />
				<p>Copyright @ 2024 - All Right Reserved.</p>
			</div>
		</div>
	)
};

export default Footer;
