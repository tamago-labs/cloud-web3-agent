import { useState } from "react"
import ListGroup from "../ListGroup" 
import { SocialIcon } from 'react-social-icons'

const Contact = () => {
    return (
        <>
 
            <section className="  relative py-14 md:py-32 md:pb-24" id="about">
                <div className=" mx-auto w-max-6xl">
                    <div>
                        <div className="heading mb-0 text-left flex flex-col  px-2">
                            <h4 className="text-center text-3xl font-bold">About Us</h4>
                            <div className="  w-full max-w-[1000px] mx-auto text-center ">
                                <p className="pt-2 sm:pt-5 pr-2 sm:pr-4 text-sm sm:text-base  ">
                                    Founded in 2022 as a Web3 software house specializing in developing applications on emerging blockchains and have achieved notable recognition and awards, solidifying our position as a leading player in the industry
                                </p>
                            </div>
                            <div className="  py-6 w-full md:max-w-[700px] mx-auto ">
                                <ListGroup
                                    items={[
                                        ["Company Name", `Tamago Blockchain Labs KK`],
                                        ["Address", `Co-Working Q, 1-1, JR Hakata City B1F`],
                                        [" ", `Hakata, Fukuoka, Japan 812-0012`],
                                        ["Established Date", `September 2022`],
                                        ["Phone Number", `(81) 80-4894-2495`],
                                        ["Email Address", `support@tamagolabs.com`]
                                    ]}
                                />
                            </div>
                        </div> 
                        {/* <div className='grid grid-cols-4 mt-[20px]  p-2 mx-auto w-full max-w-[300px]'>
                            <SocialIcon url="https://x.com/Tamago_Labs" bgColor="#08111f" />
                            <SocialIcon url="https://discord.gg/jNGqJCsegp" bgColor="#08111f" />
                            <SocialIcon url="https://www.facebook.com/tamagolabs" bgColor="#08111f" />
                            <SocialIcon url="https://www.linkedin.com/company/tamagolabs" bgColor="#08111f" />
                        </div>  */}
                    </div> 
                </div>
            </section>

        </>
    )
}

export default Contact