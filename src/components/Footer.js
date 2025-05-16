import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import styled from 'styled-components';

const StyledFooter = styled.footer`
  background-color: ${props => props.theme.headerBg};
  color: ${props => props.theme.headerText};
  padding: 1.5rem 0;
  margin-top: auto;
  
  .footer-link {
    color: ${props => props.theme.headerText};
    opacity: 0.8;
    text-decoration: none;
    transition: all 0.2s ease;
    
    &:hover {
      opacity: 1;
      text-decoration: underline;
    }
  }
`;

function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <StyledFooter>
      <Container>
        <Row className="text-center text-md-start">
          <Col md={4} className="mb-3 mb-md-0">
            <h5>AP CSA FRQ Practice</h5>
            <p className="small">
              A tool designed to help students prepare for the AP Computer Science A exam
              by practicing Free Response Questions in a simulated environment.
            </p>
          </Col>
          <Col md={4} className="mb-3 mb-md-0">
            <h5>Resources</h5>
            <ul className="list-unstyled">
              <li><a href="https://apcentral.collegeboard.org/courses/ap-computer-science-a" className="footer-link" target="_blank" rel="noopener noreferrer">AP CSA Course Home</a></li>
              <li><a href="https://apstudents.collegeboard.org/courses/ap-computer-science-a" className="footer-link" target="_blank" rel="noopener noreferrer">AP CSA Student Resources</a></li>
              <li><a href="https://apcentral.collegeboard.org/media/pdf/ap-computer-science-a-course-and-exam-description.pdf" className="footer-link" target="_blank" rel="noopener noreferrer">Course Description</a></li>
            </ul>
          </Col>
          <Col md={4}>
            <h5>Privacy Notice</h5>
            <p className="small">
              This application uses local storage to save your code and settings in your browser.
              No data is sent to any server. Your work is only saved on your device.
            </p>
          </Col>
        </Row>
        <hr className="my-3" style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
        <div className="text-center small">
          <p>© {currentYear} AP CSA FRQ Practice. Not affiliated with College Board.</p>
          <p className="mb-0">
            <a href="#terms" className="footer-link me-3">Terms of Use</a>
            <a href="#privacy" className="footer-link me-3">Privacy Policy</a>
            <a href="#contact" className="footer-link">Contact</a>
          </p>
        </div>
      </Container>
    </StyledFooter>
  );
}

// Commenting out Footer component as it's no longer rendered for minimalistic UI
// export default Footer;
