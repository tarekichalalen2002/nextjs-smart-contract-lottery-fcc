import Head from 'next/head'
// import ManualHeader from '@/components/ManualHeader'
import Header from '@/components/Header'
import LotteryEntrance from '@/components/LotteryEntrance'


export default function Home() {
  return (
    <>
      <Head>
        <title>Smart Contract Raffle</title>
        <meta name='description' content='Our Smart Contract Lottery' />
      </Head>
      <Header/>
      <LotteryEntrance />
    </>
  )
}
