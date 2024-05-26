use anchor_lang::prelude::*;

declare_id!("CvSuDrytMeHjPwRqyUgFgiWzmKbKPJj3t1Sg5dfqdpBM");

#[program]
pub mod lottery {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let state = &mut ctx.accounts.state;
        let admin = &mut ctx.accounts.admin;

        state.admin = admin.key();
        state.raffle_index = 0;

        emit!(Initialized { admin: state.admin });
        
        Ok(())
    }

    pub fn purchase_ticket(ctx: Context<PurchaseTicket>) -> Result<()> {
        Ok(())
    }

    pub fn create_raffle(ctx: Context<CreateRaffle>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = admin,
        space = 8 + GlobalState::LEN,
        seeds = [b"global_state"], 
        bump
    )]
    pub state: Account<'info, GlobalState>,
    #[account(mut)]
    pub admin: Signer<'info>,
    // account holding the contract binary
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct PurchaseTicket {}

#[derive(Accounts)]
pub struct CreateRaffle {}

#[account]
pub struct GlobalState {
    admin: Pubkey,
    raffle_index: i32,
}

impl GlobalState {
    pub const LEN: usize = 
        (1 + 32) + 
        (1 + 8);
}

#[account]
pub struct User {
    raffle_id: u32,
    referrer: Pubkey,
}

impl User {
    pub const LEN: usize = 
        (1 + 32) + 
        (1 + 32);
}

#[event]
pub struct Initialized {
    pub admin: Pubkey,
}