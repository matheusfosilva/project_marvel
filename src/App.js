import './App.css';
import { Form, Container, Card, Button, Modal, Table, Figure, Alert } from 'react-bootstrap'; //import de componentes do framework bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'; //import de framework para auxiliar no design front-end
import { useEffect, useState } from 'react'; 
import axios from 'axios'; // import de ferramenta para consumo de api 
import MapPicker from 'react-google-map-picker'; //import de biblioteca para exibição de mapa 

const DefaultLocation = { lat: -7.220086, lng: -39.3281503 };

function App() {

  // Definição de váriaveis para utilização nas modificações durante o uso da aplicação 

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
 
  // Variáveis utilizadas para configurar string de request à api 

  const timeStamp = '1641319856';
  const apiKey = process.env.REACT_APP_APIKey;
  const md5 = 'b94d9effe9952c56847c56eba20cb753';
  

  async function getComics() { // função de request da api 

    try { // função implementada para o tratamento de erros
      const response = await axios.get(`https://gateway.marvel.com/v1/public/comics?ts=${timeStamp}&apikey=${apiKey}&hash=${md5}&limit=40`); // string de request da api 
      setComics(response.data.data.results) // encapsulamento do response
      console.log(response.data.data.results);
    } catch (error) {
      console.error(error);
    }

  }

  async function searchComics() { // função de busca de quadrinhos semelhante à função de request com o parametro de tittle adicional na string de request

    try {
      const response = await axios.get(`https://gateway.marvel.com/v1/public/comics?ts=${timeStamp}&apikey=${apiKey}&hash=${md5}&title=${search}&limit=40`);
      setComics(response.data.data.results)
      console.log(response.data.data.results);
    } catch (error) {
      console.error(error);
    }

  }

  function toggleSendMessage() { //função de exibir/esconder modal de envio de quadrinhos
    setSendMessage(!sendMessage);
    setVisibleMap(false);
  }

  function handleChangeLocation(lat, lng) {//função para configuração de local no mapa
    setLocation({ lat: lat, lng: lng });
  }

  function handleChangeZoom(newZoom) { //função de zoom do mapa pega da biblioteca 
    setZoom(newZoom);
  }

  function showModal(comic) { //função de exibição de detalhes dos quadrinhos 
    setVisible(true);
    setComicModal(comic);
  }

  function hideModal() { //função de inibir detalhes dos quadrinhos
    setVisible(false);
    setComicModal(null);
  }

  function showMap() { //função de exibição do mapa
    setVisibleMap(true);
  }

  function hideMap() { //função de esconder o mapa 
    setVisibleMap(false);
  }

  useEffect(() => { // listener de atualização de página 
    getComics()
  }, []);

  
  useEffect(() => { //listener de atulização de página mediante procura de quadrinhos 
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
            <Form.Control data-testid="search" value={search} type="text" placeholder="Search a comic" onChange={(text) => setSearch(text.target.value)} /> {/*imput de busca de quadrinho */}
          </Form>
        </Container>
      </div>


      <Container>

        {selectComics?.length > 0 && ( 
          <div> 

            <Table striped bordered hover> {/*lista de quadrinhos selecionados*/}
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Comic title</th>
                  <th>Details</th>
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
                      <td>{comic.description?.length < 5 || comic.description?.length == null ? 'No description' : comic.description}</td>
                    </tr>
                  )
                })}

              </tbody>
            </Table>

            <Button variant="primary" onClick={showMap}>Send-me</Button> {/*botão de envio com ação de exibir o mapa  */}

            <Modal show={sendMessage} onHide={toggleSendMessage} > {/*exibição do modal com mensgagem de envio de quadrinhos com função de escondê-lo caso haja algum click fora do modal */}
              <Alert variant="success" style={{ margin: '0px' }}>
                <Alert.Heading style={{ textAlign: 'center' }} >Comics will send soon!</Alert.Heading>
                <hr />
                <div className="d-flex justify-content-end">
                  <Button onClick={toggleSendMessage} variant="outline-success"> {/*botão com ação de esconder o modal de mensagem de envio */}
                    Confirm
                  </Button>
                </div>
              </Alert>
            </Modal>

            <Modal show={visibleMap} onHide={hideMap}> {/* exibição do modal de mapa com ação de escondê-lo caso haja um click fora do modal  */}
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
                  apiKey='AIzaSyDaD-UyaZzx4ROA3VKDYQE9MyCXsDghkV8' /> {/*chave da api do google maps */}

              </Modal.Body>

              <Modal.Footer > {/*botões de envio de quadrinho e esconder modal*/}
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

        {comics?.map((comic) => { {/*mapemento do response e exibição atraves de cards */}
          return (

            <Card  style={{ width: '18rem', margin: '20px', backgroundColor: 'red', color: 'white' }}>
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
