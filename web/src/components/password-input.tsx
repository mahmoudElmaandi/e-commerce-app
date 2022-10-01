import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons"
import { Button, Input, InputGroup, InputRightElement, Text } from "@chakra-ui/react"
import React, { useState } from "react"

export const PasswordInput: React.FC<{ password: string, handleChange: React.ChangeEventHandler }> = ({ password, handleChange }) => {

    const [show, setShow] = useState(false)
    const handleShowIconClick = () => setShow(!show)

    return (
        <InputGroup size='sm'>
            <Input pr='4.5rem' type={show ? 'text' : 'password'} placeholder='Enter password' size='sm'
                name="password" value={password} onChange={handleChange} />

            <InputRightElement width='4.5rem'>
                <Button h='1.75rem' size='sm' onClick={handleShowIconClick} >
                    {show ?
                        <> <ViewOffIcon color='gray.300' /><Text paddingLeft='5px'> Hide </Text> </>
                        :
                        <> <ViewIcon color='gray.300' /> <Text paddingLeft='5px'> Show </Text>  </>}
                </Button>
            </InputRightElement>
        </InputGroup >
    )
}