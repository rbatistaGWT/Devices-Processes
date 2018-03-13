<?xml version="1.0" encoding="UTF-8"?>
<Workflow xmlns="http://soap.sforce.com/2006/04/metadata">
    <fieldUpdates>
        <fullName>Set_Opp_Country_Text</fullName>
        <field>Opportunity_Owner_Country_Text__c</field>
        <formula>Opportunity_Owner_Country__c</formula>
        <name>Set Opp Country Text</name>
        <notifyAssignee>false</notifyAssignee>
        <operation>Formula</operation>
        <protected>false</protected>
    </fieldUpdates>
    <rules>
        <fullName>Set Opp Country Text</fullName>
        <actions>
            <name>Set_Opp_Country_Text</name>
            <type>FieldUpdate</type>
        </actions>
        <active>true</active>
        <criteriaItems>
            <field>Invoice__c.CreatedDate</field>
            <operation>greaterThan</operation>
            <value>1/1/1900</value>
        </criteriaItems>
        <triggerType>onAllChanges</triggerType>
    </rules>
</Workflow>
