import React, { useState } from 'react';
import { Layout, Menu, Button, Input, message } from 'antd';
import Cookies from 'js-cookie';
import { Link, useNavigate } from 'react-router-dom';
import pasino from "./Pasino.png";

const { Header, Content } = Layout;

const CoinFlip = () => {
    const [bet, setBet] = useState('');
    const [selectedSide, setSelectedSide] = useState(null);
    const [result, setResult] = useState(null);
    const sessionCookie = Cookies.get('token');

    const handleBetChange = e => {
        setBet(e.target.value);
    };

    const handleSideSelect = side => {
        setSelectedSide(side);
    };

    const handleBet = () => {
        if (!bet || !selectedSide) {
            message.error('Please enter a bet and select a side.');
            return;
        }

        const outcome = Math.random() < 0.5 ? 'heads' : 'tails';
        setResult(outcome);

        if (outcome === selectedSide) {
            message.success('You won!');
        } else {
            message.error('You lost!');
        }
    };

    return (
        <Layout style={{backgroundColor: "#ffffff"}}>
            <Header style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: "#ffffff"
            }}>
                <Link to="/" style={{width: '100px', display: 'block'}}>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <img src={pasino} style={{width: "250px", marginTop: "50px"}}/>
                    </div>
                </Link>
            </Header>
            <Content style={{textAlign: 'center', backgroundColor: '#ffffff', marginTop: '50px'}}>
                <h1>Coin Flip Betting</h1>
                <div style={{marginBottom: '20px'}}>
                <Input
                        type="number"
                        value={bet}
                        onChange={handleBetChange}
                        placeholder="Enter your bet"
                        style={{ width: '200px', marginRight: '10px' }}
                    />
                    <Button type={selectedSide === 'heads' ? 'primary' : 'default'} onClick={() => handleSideSelect('heads')}>
                        Heads
                    </Button>
                    <Button type={selectedSide === 'tails' ? 'primary' : 'default'} onClick={() => handleSideSelect('tails')} style={{ marginLeft: '10px' }}>
                        Tails
                    </Button>
                </div>
                <Button type="primary" onClick={handleBet}>
                    Place Bet
                </Button>
                {result && (
                    <div style={{ marginTop: '20px' }}>
                        <h2>{`The coin landed on: ${result}`}</h2>
                    </div>
                )}
            </Content>
        </Layout>
    );
};

export default CoinFlip;