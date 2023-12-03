import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";
import "./NavbarComponent.css";

function NavbarComponent() {
  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark">
        <Container className="navbar-container">
          <Navbar.Brand href="/home">DOTA INSIGHTS</Navbar.Brand>
          <Nav className="me-auto navbar-nav">
            <Nav.Link href="/saved-matches">Saved Matches</Nav.Link>
            <Nav.Link href="#|">|</Nav.Link>
            <Nav.Link href="/">Switch Account</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

export default NavbarComponent;
