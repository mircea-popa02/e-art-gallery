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
    const [isLoading, setIsLoading] = React.useState(false);
    const [noResults, setNoResults] = React.useState(true);
    const [getPopUp, setPopUp] = React.useState(false);
    const [getPopUpColor, setPopUpColor] = React.useState(null);


    const chips = [
        "Vincent van Gogh",
        "Eduard Manet",
        "Edgar Degas",
        "Raphael Sanzio",
        "Rembrandt",
        "Matisse",
        "Cezanne",
        "Ghirlandaio",
        "Auguste Renoir",
        "Gauguin",
        "Da Vinci",
        "Titian",
        "Giotto",
        "Goya",
        "Caravaggio",
        "Botticelli",
        "Rubens",
        "Vermeer",
        "Durer",
        "El Greco",
    ]

    function handleChipClick(e) {
        console.log(e.target.innerText)
        const data = {
            data: e.target.innerText
        }
        setNoResults(true)
        setIsLoading(true)
        setImage(null)
        setColor(null)
        setPopUp(false)

        fetch('/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(res => {
                if (res.total === 0) {
                    console.log('No results')
                    setIsLoading(false)
                    setNoResults(false)
                    return
                }
                setData(res.objectIDs)
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
                        setIsLoading(false);
                        console.log(res.primaryImage)

                        Vibrant.from(res.primaryImageSmall).getPalette()
                            .catch((err) => {
                                console.log(err)
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
                            });

                        setChange(Math.random())
                    }
                    )
            })
    }


    const handleSubmit = (event) => {
        event.preventDefault()
        // console.log(event.target[0].value)
        const data = {
            data: event.target[0].value
        }
        setNoResults(true)
        setIsLoading(true)
        setImage(null)
        setColor(null)

        fetch('/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(res => {
                if (res.total === 0) {
                    console.log('No results')
                    setIsLoading(false)
                    setNoResults(false)
                    return
                }
                setData(res.objectIDs)
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
                        setIsLoading(false);
                        console.log(res.primaryImage)

                        Vibrant.from(res.primaryImageSmall).getPalette()
                            .catch((err) => {
                                console.log(err)
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
                        <div className='d-flex'>
                            <Form.Control type="text" className='form-control-lg' placeholder="Search art" style={{ fontWeight: 300 }}>
                            </Form.Control>
                            <Button type='submit' className='btn-lg' style={{ fontWeight: 300, backgroundColor: getTextHex }}>
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
                                        <>
                                            <div className='swatch d-flex'>
                                                {Object.values(palette).map((color, index) => {
                                                    return (
                                                        <div key={index} style={{ backgroundColor: color.hex, width: 24, height: 24 }} onClick={() => {
                                                            // display pop-up with hex

                                                            setPopUpColor(color.hex)
                                                            setPopUp(true)
                                                        }}>

                                                        </div>
                                                    )
                                                })}
                                            </div>

                                            
                                        </>
                                    }
                                    {getPopUp ?
                                                <div className='pop-up' style={{ backgroundColor: getPopUpColor }}>
                                                    <div className='pop-up-text'>
                                                        {getPopUpColor}
                                                    </div>
                                                </div>
                                                :
                                                null
                                            }
                                </div>
                            </div>

                        </div>
                        <div>

                            <div className="chip-container d-flex">
                                {chips.map((chip, index) => {
                                    return (
                                        <div key={index} className='chip' onClick={handleChipClick}>
                                            {chip}
                                        </div>
                                    )
                                })}

                            </div>
                        </div>
                    </>
                    :
                    <>
                        {noResults ?
                            <>
                                {
                                    isLoading ?
                                        <div className='loading'>
                                            <div className='loading-img'></div>
                                            <div className='loading-title'></div>
                                            <div className='loading-text'></div>
                                            <div className='loading-text'></div>
                                        </div >
                                        :
                                        <div className='desc'>
                                            <p className='text' style={{ color: getTextHex }}>
                                                Here you can find works of art from The Metropolitan Museum of Art Collection. Start searching by artist, title or description.

                                            </p>
                                            <div className="chip-container d-flex">
                                                {chips.map((chip, index) => {
                                                    return (
                                                        <div key={index} className='chip' onClick={handleChipClick}>
                                                            {chip}
                                                        </div>
                                                    )
                                                })}

                                            </div>

                                        </div>
                                }
                            </>
                            : <div className='desc'>
                                <p className='text' style={{ color: getTextHex }}>
                                    No results found.

                                </p>
                                <div className="chip-container d-flex">
                                    {chips.map((chip, index) => {
                                        return (
                                            <div key={index} className='chip' onClick={handleChipClick}>
                                                {chip}
                                            </div>
                                        )
                                    })}

                                </div>
                            </div>
                        }
                    </>
            }

            {
                getColor ?
                    <div className="footer" style={{ fontWeight: 300 }}>
                        <p>Created by <a style={{ color: getColor }} href="https://github.com/mircea-popa02">Mircea Popa</a></p>
                    </div>
                    : null
            }

        </>
    );
}

export default App;