const WebSocket = require('ws');
const axios = require('axios');
const { ethers } = require('ethers');

const PK_B = '0x<YOUR_PRIVATE_KEY_HERE>';
const wallet = new ethers.Wallet(PK_B);
const AGENT_ID = wallet.address; // 0x7099...

const TARGET_ID = '0x<TARGET_AGENT_ADDRESS_HERE>'; // Address A
const OPENROUTER_KEY = 'sk-or-v1-<YOUR_OPENROUTER_KEY_HERE>';

async function start() {
    console.log(`🔐 [Agent-B] Signing login payload for identity: ${AGENT_ID}...`);
    const signature = await wallet.signMessage(`NSP_LOGIN:${AGENT_ID}`);
    const ws = new WebSocket(`wss://nsp.hypernatt.com/?agentId=${AGENT_ID}&token=${signature}`);

    ws.on('open', () => {
        console.log(`🤖 [Agent-B] ECDSA Verification Passed! Relay Node Accepted.`);
        // Bidirectional Opt-In setup for the crash test
        ws.send(JSON.stringify({
            senderId: AGENT_ID,
            targetId: TARGET_ID,
            intent: 'SUBSCRIBE',
            data: {},
            timestamp: new Date().toISOString()
        }));
    });

    ws.on('message', async (data) => {
        const payload = JSON.parse(data.toString());

        if (payload.intent === 'SUBSCRIBE') {
            console.log(`🔔 [Agent-B] Nouvel abonné Web3 détecté : ${payload.senderId}`);
            ws.send(JSON.stringify({
                senderId: AGENT_ID,
                targetId: payload.senderId,
                intent: 'ACCEPT',
                data: { message: "Abonnement autorisé." },
                timestamp: new Date().toISOString()
            }));
        }

        if (payload.intent === 'REQUEST') {
            console.log(`🧠 [Agent-B] Requête sécurisée de ${payload.senderId}: "${payload.data.prompt}"`);
            try {
                const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
                    model: 'mistralai/mixtral-8x7b-instruct',
                    messages: [{ role: 'user', content: payload.data.prompt }]
                }, {
                    headers: { 'Authorization': `Bearer ${OPENROUTER_KEY}` }
                });
                const replyText = response.data.choices[0].message.content;
                
                ws.send(JSON.stringify({
                    senderId: AGENT_ID,
                    targetId: payload.senderId,
                    intent: 'INFORM',
                    data: { reply: replyText },
                    timestamp: new Date().toISOString()
                }));
                console.log(`📨 [Agent-B] Réponse renvoyée avec succès !`);
            } catch (err) {
                console.error(`❌ [Agent-B] OpenRouter Error:`, err.message);
            }
        }
    });
}
start();
