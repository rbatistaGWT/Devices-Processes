<?xml version="1.0" encoding="UTF-8"?>
<Workflow xmlns="http://soap.sforce.com/2006/04/metadata">
    <alerts>
        <fullName>New_Trunk_Order</fullName>
        <description>New Trunk Order</description>
        <protected>false</protected>
        <recipients>
            <type>accountOwner</type>
        </recipients>
        <senderType>CurrentUser</senderType>
        <template>DW_Folder/New_Trunk_Order</template>
    </alerts>
    <alerts>
        <fullName>Tracking_number_to_Rep</fullName>
        <description>Tracking number to Rep</description>
        <protected>false</protected>
        <recipients>
            <type>owner</type>
        </recipients>
        <senderType>CurrentUser</senderType>
        <template>DW_Folder/UPS_Tracking_to_Sales_Rep</template>
    </alerts>
    <fieldUpdates>
        <fullName>Tracking_Number_Sent</fullName>
        <field>Tracking_Number_Sent__c</field>
        <literalValue>1</literalValue>
        <name>Tracking Number Sent</name>
        <notifyAssignee>false</notifyAssignee>
        <operation>Literal</operation>
        <protected>false</protected>
    </fieldUpdates>
    <rules>
        <fullName>Email Order Tracking on receipt from UPS</fullName>
        <actions>
            <name>Tracking_number_to_Rep</name>
            <type>Alert</type>
        </actions>
        <actions>
            <name>Tracking_Number_Sent</name>
            <type>FieldUpdate</type>
        </actions>
        <active>true</active>
        <criteriaItems>
            <field>Inventory_Order__c.Tracking_Number__c</field>
            <operation>notEqual</operation>
        </criteriaItems>
        <criteriaItems>
            <field>Inventory_Order__c.Tracking_Number_Sent__c</field>
            <operation>equals</operation>
            <value>False</value>
        </criteriaItems>
        <description>Email Order Tracking on tracking number receipt from carrier.</description>
        <triggerType>onAllChanges</triggerType>
    </rules>
    <rules>
        <fullName>Trunk Order%3A Submitted</fullName>
        <actions>
            <name>New_Trunk_Order</name>
            <type>Alert</type>
        </actions>
        <active>true</active>
        <criteriaItems>
            <field>Inventory_Order__c.RecordTypeId</field>
            <operation>equals</operation>
            <value>Trunk Stock Replenishment</value>
        </criteriaItems>
        <criteriaItems>
            <field>Inventory_Order__c.Status__c</field>
            <operation>equals</operation>
            <value>Submitted</value>
        </criteriaItems>
        <description>Email each time a new trunk order is Submitted</description>
        <triggerType>onCreateOrTriggeringUpdate</triggerType>
    </rules>
</Workflow>
