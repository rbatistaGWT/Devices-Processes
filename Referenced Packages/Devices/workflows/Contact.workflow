<?xml version="1.0" encoding="UTF-8"?>
<Workflow xmlns="http://soap.sforce.com/2006/04/metadata">
    <fieldUpdates>
        <fullName>Set_Country_to_User_s_Country</fullName>
        <field>MailingCountry</field>
        <formula>$User.Country</formula>
        <name>Set Country to User&apos;s Country</name>
        <notifyAssignee>false</notifyAssignee>
        <operation>Formula</operation>
        <protected>false</protected>
    </fieldUpdates>
    <rules>
        <fullName>Set Country to User%27s Country</fullName>
        <actions>
            <name>Set_Country_to_User_s_Country</name>
            <type>FieldUpdate</type>
        </actions>
        <active>true</active>
        <criteriaItems>
            <field>User.Country</field>
            <operation>equals</operation>
            <value>United States</value>
        </criteriaItems>
        <criteriaItems>
            <field>Contact.MailingCountry</field>
            <operation>equals</operation>
        </criteriaItems>
        <description>This rules sets the Mailing Country to the User&apos;s Country for users in the US</description>
        <triggerType>onCreateOrTriggeringUpdate</triggerType>
    </rules>
</Workflow>
