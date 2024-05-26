import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Lottery } from "../target/types/lottery";
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  Signer,
} from "@solana/web3.js";
const { SystemProgram } = anchor.web3;

const TestProgram = async () => {
  const program = anchor.workspace.Lottery as Program<Lottery>;
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const admin = Keypair.generate();
  const [statePDA, _a] = PublicKey.findProgramAddressSync(
    [
      anchor.utils.bytes.utf8.encode("global_state"),
    ],
    program.programId
  )

  const adminSig: Signer = {
    publicKey: admin.publicKey,
    secretKey: admin.secretKey
  }

  await provider.connection.confirmTransaction(
    await provider.connection.requestAirdrop(
      provider.wallet.publicKey,
      10 * LAMPORTS_PER_SOL
    ),
    "confirmed"
  );
  await provider.connection.confirmTransaction(
    await provider.connection.requestAirdrop(
      program.programId,
      10 * LAMPORTS_PER_SOL
    ),
    "confirmed"
  );
  await provider.connection.confirmTransaction(
    await provider.connection.requestAirdrop(
      admin.publicKey,
      10 * LAMPORTS_PER_SOL
    ),
    "confirmed"
  );

  console.log("state PDA: ", statePDA.toBase58());

  
  console.log("-----------------------STARTING INITIALIZATION--------------------------");
  const tx = await program.methods.initialize().accounts(
      {
        state: statePDA,
        admin: admin.publicKey,
        systemProgram: SystemProgram.programId
      }
    ).signers([adminSig]).rpc();
  console.log("Your transaction signature", tx);
};

const runTest = async () => {
  try {
    await TestProgram();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

runTest()