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
    const [getTextHex, setTextHex] = React.useState("#e2e2e2");
    const [getColor, setColor] = React.useState(null);
    const [palette, setPalette] = React.useState(null);
    const [change, setChange] = React.useState(null);


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
                // wait 1 second before making the next request
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

                                // setBgHex('#0d089f')
                                // setColor('#oooooo')
                                // setPalette('#ffffff')
                                // setTextHex('#ffffff')
                            })
                            .then((palette) => {
                                console.log(palette)
                                if (palette === undefined) {
                                    setBgHex('#ffffff')
                                    setColor('#ffffff')
                                    setPalette(null)
                                    setTextHex('#ffffff')
                                } else {
                                    setBgHex(palette.DarkMuted.hex)
                                    setTextHex(palette.LightVibrant.hex)
                                    setColor(palette.DarkVibrant.hex)
                                    setPalette(palette)
                                }
                                console.log(palette.DarkVibrant.hex)



                                // map palette
                                // Object.values(palette).map((color, index) => {
                                //     console.log(color.hex)
                                // }
                                // )

                            });

                        setChange(Math.random())
                    }
                    )
            })
        event.target.reset()
    }


    return (
        <>

            <div className='search-form'>
                <h1 style={{ fontWeight: 300, color: getTextHex, marginBottom: 16 }}>Find your <br></br><p style={{ fontWeight: 700 }}>inspiration</p></h1>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formBasicEmail">
                        {/* <Form.Label>Find works of art</Form.Label> */}
                        <div className='d-flex'>
                            <Form.Control type="text" className='form-control-lg' placeholder="Search art" style={{ fontWeight: 300 }}>
                            </Form.Control>
                            <Button type='submit' className='btn-lg' style={{ fontWeight: 300 }}>
                                Submit
                            </Button>
                        </div>
                        <Form.Text className="text-muted" style={{ fontWeight: 300 }}>
                            The Metropolitan Museum of Art Collection
                        </Form.Text>
                    </Form.Group>
                </Form>
            </div>

            {
                image ?
                    <>
                        <div key={getBgHex} className='box1' style={{ background: 'radial-gradient(at top left,' + getColor + ', #000000, #000000)' }}>
                        </div>
                        <div key={getColor} className='box2' style={{ background: 'radial-gradient(at top right,' + getBgHex + ', #000000, #000000)' }}>
                        </div>
                        <div key={change} className='search-result d-flex' style={{
                            color: getTextHex
                        }}>
                            <div>
                                <img src={image.primaryImage} alt={image.title} />
                            </div>
                            <div className='info-container'>
                                <h1> {image.title} </h1>
                                {image.artistDisplayName && <h3 style={{ color: getColor, fontWeight: 500 }}>{image.artistDisplayName}</h3>}
                                <h4 style={{ color: getColor, fontWeight: 300 }}>{image.objectDate}</h4>
                                <h4 style={{ color: getColor, fontWeight: 300 }}>{image.medium}</h4>
                                <h5 style={{ color: getColor, fontWeight: 300 }}>{image.dimensions}</h5>
                                <div>
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
                            </div>

                        </div>
                    </>
                    :
                    <Container className='d-flex justify-content-center'>
                        <h1>...</h1>
                    </Container>
            }

            {getColor ?
                <div className="footer" style={{ fontWeight: 300 }}>
                    <p>Created by <a style={{ textDecoration: 'none', color: getColor }} href="https://github.com/mircea-popa02">Mircea Popa</a></p>
                </div>
                : null
            }

        </>
    );
}

export default App;