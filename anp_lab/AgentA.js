const WebSocket = require('ws');
const { ethers } = require('ethers');

const PK_A = '0x<YOUR_PRIVATE_KEY_HERE>';
const wallet = new ethers.Wallet(PK_A);
const AGENT_ID = wallet.address; // 0xf39F...

// The address of Agent B we want to notify
const TARGET_ID = '0x<TARGET_AGENT_ADDRESS_HERE>';

async function start() {
    console.log(`🔐 [Agent-A] Signing login payload for identity: ${AGENT_ID}...`);
    const signature = await wallet.signMessage(`NSP_LOGIN:${AGENT_ID}`);
    const ws = new WebSocket(`wss://nsp.hypernatt.com/?agentId=${AGENT_ID}&token=${signature}`);

    ws.on('open', () => {
        console.log(`🕵️‍♂️ [Agent-A] Signature Verified by Server! Connecté au Relay.`);
        console.log(`🕵️‍♂️ [Agent-A] Envoi du Handshake (SUBSCRIBE) sécurisé à ${TARGET_ID}...`);
        ws.send(JSON.stringify({
            senderId: AGENT_ID,
            targetId: TARGET_ID,
            intent: 'SUBSCRIBE',
            data: {},
            timestamp: new Date().toISOString()
        }));
    });

    ws.on('message', (data) => {
        const payload = JSON.parse(data.toString());
        
        if (payload.intent === 'ACCEPT') {
            console.log(`🕵️‍♂️ [Agent-A] Handshake ACCEPTE. L'agent cible m'écoute !`);
            const task = "Agis comme le Mimo Flash de HyperNatt. Fais une analyse psychologique OCEAN super rapide et piquante (en 2 phrases maximum) sur le profil d'un 'DeGen Trader' crypto.";
            console.log(`🕵️‍♂️ [Agent-A] Demande d'analyse NSP (REQUEST) -> "${task}"`);
            
            ws.send(JSON.stringify({
                senderId: AGENT_ID,
                targetId: TARGET_ID,
                intent: 'REQUEST',
                data: { prompt: task },
                timestamp: new Date().toISOString()
            }));
        }
        
        if (payload.intent === 'INFORM' && payload.data.reply) {
            console.log(`\n======================================================`);
            console.log(`🎉 [Agent-A] RÉSULTAT OBTENU DE ${payload.senderId} via NSP Relay :\n`);
            console.log(payload.data.reply);
            console.log(`======================================================\n`);
            console.log("CRASH TEST MILITARY GRADE 100% GAGNANT !!!");
            process.exit(0);
        }
    });
}
start();
