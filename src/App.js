import React from 'react';
import './App.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import 'bootstrap/dist/css/bootstrap.css';
const Vibrant = require('node-vibrant')


const App = () => {
    const [data, setData] = React.useState(null);
    const [image, setImage] = React.useState(null);
    const [getBgHex, setBgHex] = React.useState(null);
    const [getTextHex, setTextHex] = React.useState(null);
    const [palette, setPalette] = React.useState(null);

    const handleSubmit = (event) => {
        event.preventDefault()
        // console.log(event.target[0].value)
        const data = {
            data: event.target[0].value
        }


        fetch('/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(res => {
                // console.log(res)

                setData(res.objectIDs)
                // console.log(res.objectIDs)

                fetch('/object', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ data: res.objectIDs })
                })
                    .then(res => res.json())
                    .then(res => {
                        console.log(res)

                        setImage(res)
                        console.log(res.primaryImage)
                        Vibrant.from(res.primaryImageSmall).getPalette()
                            .catch((err) => {
                                console.log(err)
                                // search-resolt background color should be white
                                setBgHex('#ffffff')
                            })
                            .then((palette) => {
                                console.log(palette)
                                console.log(palette.DarkVibrant.hex)

                                setBgHex(palette.DarkMuted.hex)
                                setTextHex(palette.LightVibrant.hex)
                                setPalette(palette)

                                // map palette
                                Object.values(palette).map((color, index) => {
                                    console.log(color.hex)
                                }
                                )

                            });
                    }
                    )
            })
        event.target.reset()
    }


    return (
        <> 
            <Container>
            <h1 className='text-center'>Search for famous paintings</h1>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formBasicEmail">
                        {/* <Form.Label>Find works of art</Form.Label> */}
                        <div className='d-flex'>
                            <Form.Control type="text" placeholder="Search art" />
                            <Button type='submit'>
                                Submit
                            </Button>
                        </div>
                        <Form.Text className="text-muted">
                            The Metropolitan Museum of Art Collection
                        </Form.Text>
                    </Form.Group>
                </Form>
            </Container>

            {
                image &&
                <div className='search-result d-flex row' style={{ backgroundColor: getBgHex, color: getTextHex }}>
                    <img src={image.primaryImage} alt={image.title} />
                    <div className='info-container col'>
                        <h1>{image.title}</h1>
                        {image.artistDisplayName && <h2>{image.artistDisplayName}</h2>}
                        <h3>{image.objectDate}</h3>
                        <h4>{image.medium}</h4>
                        <h5>{image.dimensions}</h5>
                    </div>
                    

                    {palette &&
                        <div className='swatch d-flex'>
                            {Object.values(palette).map((color, index) => {
                                return (
                                    <div key={index} style={{ backgroundColor: color.hex, width: 16, height: 16 }}>

                                    </div>
                                )
                            })}
                        </div>
                    }
                </div>
            }
        </>
    );
}

export default App;