import './App.css';
import {Form,Container,Card, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import axios from 'axios';


function App() {

  //const [input, setInput ] = useState(0);
  const [comics, setComics ] = useState([]);
    
    async function getComics(){

        const timeStamp = '1641319856';
        const apiKey = '2690be4165b30b415ca788849e00c3dd';
        const md5 = 'b94d9effe9952c56847c56eba20cb753';

      try {
        const response  = await axios.get(`http://gateway.marvel.com/v1/public/comics?ts=${timeStamp}&apikey=${apiKey}&hash=${md5}`);
        setComics(response.data.data.results)
        console.log(response.data.data.results);
      } catch (error) {
        console.error(error);
      }

    }

    useEffect(() => {
      getComics()      
    },[]);

  return (
    <div className="App">
      
       <Container className='container'>
          <Form>
            <Form.Control type="text" placeholder="Digite o nome do quadrinho"  />
          </Form>
       </Container>
      
      <Container style={
       { display: 'flex', 
        flexWrap: 'wrap',
        justifyContent: 'center'
      }
      }>
        {comics?.map((comic) => {
            return ( 
            <Card style={{  width: '18rem' , margin: '20px' ,  }}>
            <Card.Img variant="top" src={comic.thumbnail.path + '.jpg'}  /> 
              <Card.Body>
                <Card.Title>{comic.title}</Card.Title>
                {/* <Card.Text>{comic.description}</Card.Text>  
                <Button variant="primary">Detalhes </Button>  */}
              </Card.Body>
            </Card>
        )
          })}  
      </Container>  
      
      
    </div>
  );
}

export default App;
