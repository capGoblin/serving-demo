'use client';

import { createZGServingNetworkBroker } from '@0glabs/0g-serving-broker';
import { OpenAI } from 'openai';
import { useEffect, useState } from 'react';
import { useAccount, useWalletClient } from 'wagmi';
import { BrowserProvider } from 'ethers';
import { ethers } from 'ethers';

export default function Home() {
  const { data: walletClient } = useWalletClient();
  const { address } = useAccount();
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [broker, setBroker] = useState<any>();
  const [services, setServices] = useState<any>();

  const getMetaMaskSigner = async () => {
    // Check if MetaMask is installed
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed');
    }

    // Request account access
    await window.ethereum.request({ method: 'eth_requestAccounts' });

    // Create provider and signer
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    return signer;
  };

  async function getAccountaa() {
    try {
      console.log('Servies', services);
      const balance = await broker.getAccount(services[0].provider);
      console.log(balance);
      if (!balance) {
        await broker.addAccount(services[0].provider, 0.01);
      }
      // if (balance) {
      //   setShowChat(true);
      // } else {
      //   setShowAccountDialog(true);
      // }
    } catch (error: any) {
      await broker.addAccount(services[0].provider, 0.01);
      // console.error("Error checking balance:", error);
      // Check if error is about account not existing
    }
  }

  const getServices = async (): Promise<void> => {
    // if (!walletClient || !address) {
    //   console.log("No wallet client or address available");
    //   return;
    // }

    const signer = await getMetaMaskSigner();
    console.log('Signer created:', await signer.getAddress());

    const broker = await createZGServingNetworkBroker(signer);
    const services = await broker.listService();
    setBroker(broker);
    setServices(services);
    console.log(services);
  };

  useEffect(() => {
    getAccountaa();
  }, [services]);

  // async function handleChatNow() {
  //   if (!signer || selectedModelIndex === null || !broker) return;

  //   setIsCheckingAccount(true);
  //   try {
  //     const balance = await broker.getAccount(
  //       models[selectedModelIndex].provider
  //     );
  //     setBalance(balance);

  //     // If account exists, navigate to chat
  //     if (balance) {
  //       setShowChat(true);
  //     } else {
  //       setShowAccountDialog(true);
  //     }
  //   } catch (error: any) {
  //     console.error("Error checking balance:", error);
  //     // Check if error is about account not existing
  //     if (error.message?.includes("AccountNotexists")) {
  //       setShowAccountDialog(true); // Show account creation dialog
  //       setErrorMessage("Account not found. Please create a new account.");
  //     } else {
  //       setErrorMessage("Unable to check account balance. Please try again.");
  //     }
  //   } finally {
  //     setIsCheckingAccount(false);
  //   }
  // }

  // useEffect(() => {

  // }, [])

  // const callService = async () => {
  //   if (!walletClient || !address) {
  //     console.log("No wallet client or address available");
  //     return;
  //   }

  //   try {
  //     setLoading(true);
  //     console.log("Starting service call with address:", address);

  //     // Convert walletClient to ethers signer
  //     const provider = new BrowserProvider(walletClient);
  //     const signer = await provider.getSigner();
  //     console.log("Signer created:", await signer.getAddress());

  //     // Initialize broker
  //     const broker = await createZGServingNetworkBroker(signer);
  //     console.log("Broker initialized");

  //     // Get available services
  //     const services = await broker.listService();
  //     console.log("Available services:", services);

  //     if (!services || services.length === 0) {
  //       throw new Error("No services available");
  //     }

  //     const service = services[0];
  //     console.log("Selected service:", service);

  //     // Create and fund account for the provider if needed
  //     try {
  //       console.log("Attempting to create account for provider:", service.provider);
  //       // Note: addAccount is payable and needs additional parameters
  //       await broker.addAccount(
  //         service.provider,
  //        signer, // signer public key
  //         "", // additional info
  //         { value: ethers.parseEther("0.005") } // sending 0.005 ETH
  //       );
  //       console.log("Account created successfully");
  //     } catch (e) {
  //       console.log("Error creating account:", e);
  //       console.log("Attempting to deposit funds instead...");
  //       // depositFund is payable
  //       await broker.depositFund(
  //         service.provider,
  //         { value: ethers.parseEther("0.005") } // sending 0.005 ETH
  //       );
  //       console.log("Funds deposited successfully");
  //     }

  //     // Get service metadata
  //     console.log("Fetching service metadata...");
  //     const { endpoint, model } = await broker.getServiceMetadata(
  //       service.provider,
  //       service.name
  //     );
  //     console.log("Service metadata:", { endpoint, model });

  //     const content = "Hello, how are you?";
  //     console.log("Getting request headers for content:", content);
  //     const headers = await broker.getRequestHeaders(
  //       service.provider,
  //       service.name,
  //       content
  //     );
  //     console.log("Request headers received:", headers);

  //     console.log("Initializing OpenAI client with endpoint:", endpoint);
  //     const openai = new OpenAI({
  //       baseURL: endpoint,
  //       apiKey: '',
  //     });

  //     console.log("Making completion request...");
  //     const completion = await openai.chat.completions.create(
  //       {
  //         messages: [{ role: 'user', content }],
  //         model: model,
  //       },
  //       { headers }
  //     );
  //     console.log("Completion response:", completion);

  //     const responseContent = completion.choices[0].message.content;
  //     console.log("Setting response content:", responseContent);
  //     setResponse(responseContent);

  //     console.log("Processing response...");
  //     await broker.processResponse(
  //       service.provider,
  //       service.name,
  //       responseContent
  //     );
  //     console.log("Response processed successfully");

  //   } catch (error) {
  //     console.error('Error in callService:', error);
  //   } finally {
  //     console.log("Service call completed");
  //     setLoading(false);
  //   }
  // };
  const request = async () => {
    await broker.settleFee(services[0].provider, services[0].name, 0.00000000001);
    const providerAddress = services[0].provider;
    const serviceName = services[0].name;
    const { endpoint, model } = await broker.getServiceMetadata(providerAddress, serviceName);
    const prompt = 'what model are you?';
    const headers = await broker.getRequestHeaders(providerAddress, serviceName, prompt);

    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ endpoint, model, prompt, headers }),
    });
    const completion = await response.json();

    if (completion) {
      console.log(completion);
      const response = completion.choices[0].message.content;
      console.log(response);
    }
  };

  return (
    <main className="min-h-screen p-8 bg-white">
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <button
          onClick={getServices}
          className="px-6 py-3 text-lg font-bold text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 shadow-lg"
        >
          Connect to Service
        </button>
        <button
          onClick={request}
          className="px-6 py-3 text-lg font-bold text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 shadow-lg"
        >
          req
        </button>
      </div>
    </main>
  );
}
