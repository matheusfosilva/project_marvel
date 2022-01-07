import './App.css';
import { Form, Container, Card, Button, Modal, Table, Figure, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import MapPicker from 'react-google-map-picker';

const DefaultLocation = { lat: -7.220086, lng: -39.3281503 };

function App() {

  //const [input, setInput ] = useState(0);
  const [comics, setComics] = useState([]);
  const [visible, setVisible] = useState(false);
  const [comicModal, setComicModal] = useState(null);
  const [search, setSearch] = useState('');
  const [selectComics, setSelectComics] = useState([]);
  const [visibleMap, setVisibleMap] = useState(false);
  const [zoom, setZoom] = useState(10);
  const [defaultLocation, setDefaultLocation] = useState(DefaultLocation);
  const [location, setLocation] = useState(defaultLocation)
  const [sendMessage, setSendMessage] = useState(false)
 

  const timeStamp = '1641319856';
  const apiKey = '2690be4165b30b415ca788849e00c3dd';
  const md5 = 'b94d9effe9952c56847c56eba20cb753';

  async function getComics() {

    try {
      const response = await axios.get(`http://gateway.marvel.com/v1/public/comics?ts=${timeStamp}&apikey=${apiKey}&hash=${md5}&limit=10`);
      setComics(response.data.data.results)
      console.log(response.data.data.results);
    } catch (error) {
      console.error(error);
    }

  }

  async function searchComics() {

    try {
      const response = await axios.get(`http://gateway.marvel.com/v1/public/comics?ts=${timeStamp}&apikey=${apiKey}&hash=${md5}&title=${search}`);
      setComics(response.data.data.results)
      console.log(response.data.data.results);
    } catch (error) {
      console.error(error);
    }

  }

  function toggleSendMessage() {
    setSendMessage(!sendMessage);
    setVisibleMap(false);
  }

  function handleChangeLocation(lat, lng) {
    setLocation({ lat: lat, lng: lng });
  }

  function handleChangeZoom(newZoom) {
    setZoom(newZoom);
  }

  function showModal(comic) {
    setVisible(true);
    setComicModal(comic);
  }

  function hideModal() {
    setVisible(false);
    setComicModal(null);
  }

  function showMap() {
    setVisibleMap(true);
  }

  function hideMap() {
    setVisibleMap(false);
  }

  useEffect(() => {
    getComics()
  }, []);

  useEffect(() => {
    getComics()
  }, []);

  useEffect(() => {
    if (search?.length > 0) {
      searchComics()
    } else {
      getComics();
    }
  }, [search]);

  return (
    <div className="App" >

      <div style={{ display: 'flex', backgroundColor: 'black' }}>
        <Container className='container'>
          <Form>
            <Form.Control data-testid="search" value={search} type="text" placeholder="Search a comic" onChange={(text) => setSearch(text.target.value)} />
          </Form>
        </Container>
      </div>


      <Container>

        {selectComics?.length > 0 && (
          <div>

            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Comic title</th>
                </tr>
              </thead>
              <tbody>
                {selectComics.map((comic) => {
                  return (
                    <tr>
                      <td>
                        <Figure>
                          <Figure.Image
                            width={50}
                            src={comic.thumbnail.path + '.' + comic.thumbnail.extension}
                          />
                        </Figure>
                      </td>
                      <td>{comic.title}</td>
                    </tr>
                  )
                })}

              </tbody>
            </Table>

            <Button variant="primary" onClick={showMap}>Send-me</Button>

            <Modal show={sendMessage} onHide={toggleSendMessage} >
              <Alert variant="success" style={{ margin: '0px' }}>
                <Alert.Heading style={{ textAlign: 'center' }} >Comics will send soon!</Alert.Heading>
                <hr />
                <div className="d-flex justify-content-end">
                  <Button onClick={toggleSendMessage} variant="outline-success">
                    Confirm
                  </Button>
                </div>
              </Alert>
            </Modal>

            <Modal show={visibleMap} onHide={hideMap}>
              <Modal.Header >
                <Modal.Title>Select your andress in the map: </Modal.Title>
              </Modal.Header>

              <Modal.Body>

                <MapPicker defaultLocation={defaultLocation}
                  zoom={zoom}
                  mapTypeId="roadmap"
                  style={{ height: '700px' }}
                  onChangeLocation={handleChangeLocation}
                  onChangeZoom={handleChangeZoom}
                  apiKey='AIzaSyDaD-UyaZzx4ROA3VKDYQE9MyCXsDghkV8' />

              </Modal.Body>

              <Modal.Footer >
                <Button variant="secondary" onClick={hideMap}>Back</Button>
                <Button variant="primary" onClick={toggleSendMessage}>Send</Button>
              </Modal.Footer>
            </Modal>

          </div>

        )}
      </Container >


      <Container data-testid="cartao" style={

        {
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }

      }>

        {comics?.map((comic) => {
          return (

            <Card style={{ width: '18rem', margin: '20px', backgroundColor: 'red', color: 'white' }}>
              <Card.Img variant="top" src={comic.thumbnail.path + '.' + comic.thumbnail.extension} />
              <Card.Body  >

                <div  >

                  <Card.Title  >{comic.title}</Card.Title>

                  <div style={{ display: "flex", justifyContent: "space-around" }}  >
                    <Button variant="outline-light" onClick={() => showModal(comic)}> Details </Button>

                    {
                      selectComics.find(element => element.id == comic.id) ?
                        <Button variant="outline-light" onClick={() => {
                          setSelectComics(selectComics.filter(elemento => {
                            return elemento.id != comic.id
                          }))
                        }} >Remove</Button>
                        : <Button variant="outline-light" onClick={() =>
                          setSelectComics(selectComics.concat(comic))}>Add</Button>

                    }

                  </div>
                </div>

              </Card.Body>
            </Card>

          )
        })}

        {comicModal && (

          <Modal show={visible} onHide={hideModal} >
            <Modal.Header  >
              <Modal.Title>{comicModal.title}</Modal.Title>
            </Modal.Header>

            <Modal.Body >
              <p>{comicModal.description?.length === 0 || comicModal.description?.length == null ? 'No description' : comicModal.description}</p>
            </Modal.Body>

            <Modal.Footer   >
              <Button variant="outline-danger" onClick={hideModal} >back</Button>
            </Modal.Footer>
          </Modal>
        )}

      </Container>

    </div >
  );
}

export default App;
